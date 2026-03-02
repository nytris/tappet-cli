/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { InitialisationError } from '../../../src/Exception/InitialisationError.ts';
import { NpmInstaller } from '../../../src/Installer/NpmInstaller.ts';
import { ProcessRunnerInterface } from '../../../src/Process/ProcessRunnerInterface.ts';
import { expect } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';

describe('NpmInstaller', () => {
    let processRunner: sinon.SinonStubbedInstance<ProcessRunnerInterface>;
    let installer: NpmInstaller;

    beforeEach(() => {
        processRunner =
            stubInterface<ProcessRunnerInterface>() as sinon.SinonStubbedInstance<ProcessRunnerInterface>;

        processRunner.run.returns({ status: 0 });

        installer = new NpmInstaller(processRunner);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('install()', () => {
        it('should run npm install with the package name', () => {
            installer.install('@tappet/cypress');

            expect(processRunner.run).to.have.been.calledOnce;
            expect(processRunner.run.firstCall.args[0]).to.equal('npm');
            expect(processRunner.run.firstCall.args[1]).to.deep.equal([
                'install',
                '--save-dev',
                '@tappet/cypress',
            ]);
        });

        it('should install the package as a dev dependency', () => {
            installer.install('@tappet/cypress');

            const args = processRunner.run.firstCall.args[1] as string[];
            expect(args).to.include('--save-dev');
        });

        it('should throw an InitialisationError when npm returns a non-zero exit code', () => {
            processRunner.run.returns({ status: 1 });

            expect(() => installer.install('@tappet/cypress')).to.throw(
                InitialisationError,
            );
        });

        it('should include the package name in the error message when installation fails', () => {
            processRunner.run.returns({ status: 1 });

            expect(() => installer.install('@tappet/cypress')).to.throw(
                '@tappet/cypress',
            );
        });

        it('should include the exit code in the error message when installation fails', () => {
            processRunner.run.returns({ status: 2 });

            expect(() => installer.install('@tappet/cypress')).to.throw('2');
        });
    });
});
