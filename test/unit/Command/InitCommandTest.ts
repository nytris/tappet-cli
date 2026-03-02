/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { InitCommand } from '../../../src/Command/InitCommand.ts';
import { ConfigFileDetectorInterface } from '../../../src/Config/ConfigFileDetectorInterface.ts';
import { ConfigFileWriterInterface } from '../../../src/Config/ConfigFileWriterInterface.ts';
import { ComposerInstallerInterface } from '../../../src/Installer/ComposerInstallerInterface.ts';
import { NpmInstallerInterface } from '../../../src/Installer/NpmInstallerInterface.ts';
import { OutputInterface } from '../../../src/Io/OutputInterface.ts';
import { PromptInterface } from '../../../src/Io/PromptInterface.ts';
import { expect } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';

describe('InitCommand', () => {
    let composerInstaller: sinon.SinonStubbedInstance<ComposerInstallerInterface>;
    let configFileDetector: sinon.SinonStubbedInstance<ConfigFileDetectorInterface>;
    let configFileWriter: sinon.SinonStubbedInstance<ConfigFileWriterInterface>;
    let npmInstaller: sinon.SinonStubbedInstance<NpmInstallerInterface>;
    let prompt: sinon.SinonStubbedInstance<PromptInterface>;
    let stdout: sinon.SinonStubbedInstance<OutputInterface>;
    let stderr: sinon.SinonStubbedInstance<OutputInterface>;
    let command: InitCommand;

    beforeEach(() => {
        composerInstaller =
            stubInterface<ComposerInstallerInterface>() as sinon.SinonStubbedInstance<ComposerInstallerInterface>;
        configFileDetector =
            stubInterface<ConfigFileDetectorInterface>() as sinon.SinonStubbedInstance<ConfigFileDetectorInterface>;
        configFileWriter =
            stubInterface<ConfigFileWriterInterface>() as sinon.SinonStubbedInstance<ConfigFileWriterInterface>;
        npmInstaller =
            stubInterface<NpmInstallerInterface>() as sinon.SinonStubbedInstance<NpmInstallerInterface>;
        prompt =
            stubInterface<PromptInterface>() as sinon.SinonStubbedInstance<PromptInterface>;
        stdout =
            stubInterface<OutputInterface>() as sinon.SinonStubbedInstance<OutputInterface>;
        stderr =
            stubInterface<OutputInterface>() as sinon.SinonStubbedInstance<OutputInterface>;

        composerInstaller.ensureInstalled.resolves();
        configFileDetector.exists.returns(false);
        prompt.chooseAdapter.resolves('cypress');

        command = new InitCommand(
            composerInstaller,
            configFileDetector,
            configFileWriter,
            npmInstaller,
            prompt,
            stdout,
            stderr,
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('run()', () => {
        it('should prompt the user to choose an adapter', async () => {
            await command.run();

            expect(prompt.chooseAdapter).to.have.been.calledOnce;
        });

        it('should install the @tappet/cypress NPM package when Cypress is chosen', async () => {
            prompt.chooseAdapter.resolves('cypress');

            await command.run();

            expect(npmInstaller.install).to.have.been.calledOnceWith(
                '@tappet/cypress',
            );
        });

        it('should ensure nytris/tappet is installed via Composer', async () => {
            await command.run();

            expect(
                composerInstaller.ensureInstalled,
            ).to.have.been.calledOnceWith('nytris/tappet');
        });

        it('should write the config file with the chosen adapter', async () => {
            prompt.chooseAdapter.resolves('cypress');

            await command.run();

            expect(configFileWriter.write).to.have.been.calledOnceWith(
                'cypress',
            );
        });

        it('should write a welcome message to stdout', async () => {
            await command.run();

            expect(stdout.write).to.have.been.called;
            expect(stdout.write.firstCall.args[0]).to.include(
                'Welcome to Tappet',
            );
        });

        it('should write a completion message to stdout after setup', async () => {
            prompt.chooseAdapter.resolves('cypress');

            await command.run();

            const allOutput = stdout.write.args.map((args) => args[0]).join('');
            expect(allOutput).to.include('Cypress');
        });

        it('should write a warning to stderr when a config file already exists', async () => {
            configFileDetector.exists.returns(true);

            await command.run();

            expect(stderr.write).to.have.been.calledOnce;
            expect(stderr.write.firstCall.args[0]).to.include('Warning');
        });

        it('should not write a warning to stderr when no config file exists', async () => {
            configFileDetector.exists.returns(false);

            await command.run();

            expect(stderr.write).not.to.have.been.called;
        });

        it('should install the NPM package before ensuring Composer package is installed', async () => {
            await command.run();

            expect(npmInstaller.install).to.have.been.calledBefore(
                composerInstaller.ensureInstalled,
            );
        });

        it('should write the config file after installing packages', async () => {
            await command.run();

            expect(configFileWriter.write).to.have.been.calledAfter(
                composerInstaller.ensureInstalled,
            );
        });
    });
});
