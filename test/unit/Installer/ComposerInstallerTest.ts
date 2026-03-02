/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { InitialisationError } from '../../../src/Exception/InitialisationError.ts';
import { FilesystemInterface } from '../../../src/Filesystem/FilesystemInterface.ts';
import { ComposerInstaller } from '../../../src/Installer/ComposerInstaller.ts';
import { OutputInterface } from '../../../src/Io/OutputInterface.ts';
import { ComposerCheckerInterface } from '../../../src/Process/ComposerCheckerInterface.ts';
import { ProcessRunnerInterface } from '../../../src/Process/ProcessRunnerInterface.ts';
import { expect } from 'chai';
import { join } from 'path';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';

describe('ComposerInstaller', () => {
    let composerChecker: sinon.SinonStubbedInstance<ComposerCheckerInterface>;
    let filesystem: sinon.SinonStubbedInstance<FilesystemInterface>;
    let processRunner: sinon.SinonStubbedInstance<ProcessRunnerInterface>;
    let stderr: sinon.SinonStubbedInstance<OutputInterface>;
    let installer: ComposerInstaller;
    let cwd: string;

    beforeEach(() => {
        composerChecker =
            stubInterface<ComposerCheckerInterface>() as sinon.SinonStubbedInstance<ComposerCheckerInterface>;
        filesystem =
            stubInterface<FilesystemInterface>() as sinon.SinonStubbedInstance<FilesystemInterface>;
        processRunner =
            stubInterface<ProcessRunnerInterface>() as sinon.SinonStubbedInstance<ProcessRunnerInterface>;
        stderr =
            stubInterface<OutputInterface>() as sinon.SinonStubbedInstance<OutputInterface>;

        cwd = process.cwd();
        composerChecker.isAvailable.returns(true);
        filesystem.existsSync.returns(false);
        processRunner.run.returns({ status: 0 });

        installer = new ComposerInstaller(
            composerChecker,
            filesystem,
            processRunner,
            stderr,
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('ensureInstalled()', () => {
        it('should not run composer when the package is already installed', async () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.lock'))
                .returns(true);
            filesystem.readFileSync
                .withArgs(join(cwd, 'composer.lock'), 'utf8')
                .returns(
                    JSON.stringify({ packages: [{ name: 'nytris/tappet' }] }),
                );

            await installer.ensureInstalled('nytris/tappet');

            expect(processRunner.run).not.to.have.been.called;
        });

        it('should run composer require when the package is not installed', async () => {
            await installer.ensureInstalled('nytris/tappet');

            expect(processRunner.run).to.have.been.calledOnce;
            expect(processRunner.run.firstCall.args[0]).to.equal('composer');
            expect(processRunner.run.firstCall.args[1]).to.deep.equal([
                'require',
                '--dev',
                'nytris/tappet',
            ]);
        });

        it('should install the package as a dev dependency', async () => {
            await installer.ensureInstalled('nytris/tappet');

            const args = processRunner.run.firstCall.args[1] as string[];
            expect(args).to.include('--dev');
        });

        it('should write a warning to stderr and skip installation when Composer is not available', async () => {
            composerChecker.isAvailable.returns(false);

            await installer.ensureInstalled('nytris/tappet');

            expect(processRunner.run).not.to.have.been.called;
            expect(stderr.write).to.have.been.calledOnce;
            expect(stderr.write.firstCall.args[0]).to.include('Warning');
            expect(stderr.write.firstCall.args[0]).to.include('nytris/tappet');
        });

        it('should throw an InitialisationError when composer returns a non-zero exit code', async () => {
            processRunner.run.returns({ status: 1 });

            await expect(
                installer.ensureInstalled('nytris/tappet'),
            ).to.be.rejectedWith(InitialisationError);
        });
    });

    describe('isInstalled()', () => {
        it('should return false when neither composer.lock nor composer.json exists', () => {
            filesystem.existsSync.returns(false);

            expect(installer.isInstalled('nytris/tappet')).to.be.false;
        });

        it('should return true when the package is listed in composer.lock packages', () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.lock'))
                .returns(true);
            filesystem.readFileSync
                .withArgs(join(cwd, 'composer.lock'), 'utf8')
                .returns(
                    JSON.stringify({ packages: [{ name: 'nytris/tappet' }] }),
                );

            expect(installer.isInstalled('nytris/tappet')).to.be.true;
        });

        it('should return true when the package is listed in composer.lock packages-dev', () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.lock'))
                .returns(true);
            filesystem.readFileSync
                .withArgs(join(cwd, 'composer.lock'), 'utf8')
                .returns(
                    JSON.stringify({
                        'packages-dev': [{ name: 'nytris/tappet' }],
                    }),
                );

            expect(installer.isInstalled('nytris/tappet')).to.be.true;
        });

        it('should return false when the package is not listed in composer.lock', () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.lock'))
                .returns(true);
            filesystem.readFileSync
                .withArgs(join(cwd, 'composer.lock'), 'utf8')
                .returns(
                    JSON.stringify({ packages: [{ name: 'other/package' }] }),
                );

            expect(installer.isInstalled('nytris/tappet')).to.be.false;
        });

        it('should fall back to composer.json when composer.lock does not exist', () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.lock'))
                .returns(false);
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.json'))
                .returns(true);
            filesystem.readFileSync
                .withArgs(join(cwd, 'composer.json'), 'utf8')
                .returns(
                    JSON.stringify({ require: { 'nytris/tappet': '^1.0' } }),
                );

            expect(installer.isInstalled('nytris/tappet')).to.be.true;
        });

        it('should detect the package in composer.json require-dev', () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.lock'))
                .returns(false);
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.json'))
                .returns(true);
            filesystem.readFileSync
                .withArgs(join(cwd, 'composer.json'), 'utf8')
                .returns(
                    JSON.stringify({
                        'require-dev': { 'nytris/tappet': '^1.0' },
                    }),
                );

            expect(installer.isInstalled('nytris/tappet')).to.be.true;
        });

        it('should return false when the package is not in composer.json', () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.lock'))
                .returns(false);
            filesystem.existsSync
                .withArgs(join(cwd, 'composer.json'))
                .returns(true);
            filesystem.readFileSync
                .withArgs(join(cwd, 'composer.json'), 'utf8')
                .returns(
                    JSON.stringify({ require: { 'other/package': '^1.0' } }),
                );

            expect(installer.isInstalled('nytris/tappet')).to.be.false;
        });
    });
});
