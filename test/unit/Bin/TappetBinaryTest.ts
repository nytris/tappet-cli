/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { TappetBinary } from '../../../src/Bin/TappetBinary.ts';
import { InitCommandInterface } from '../../../src/Command/InitCommandInterface.ts';
import { ConfigFileDetectorInterface } from '../../../src/Config/ConfigFileDetectorInterface.ts';
import { OutputInterface } from '../../../src/Io/OutputInterface.ts';
import { expect } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';

describe('TappetBinary', () => {
    let configFileDetector: sinon.SinonStubbedInstance<ConfigFileDetectorInterface>;
    let initCommand: sinon.SinonStubbedInstance<InitCommandInterface>;
    let stdout: sinon.SinonStubbedInstance<OutputInterface>;
    let stderr: sinon.SinonStubbedInstance<OutputInterface>;
    let binary: TappetBinary;

    beforeEach(() => {
        configFileDetector =
            stubInterface<ConfigFileDetectorInterface>() as sinon.SinonStubbedInstance<ConfigFileDetectorInterface>;
        initCommand =
            stubInterface<InitCommandInterface>() as sinon.SinonStubbedInstance<InitCommandInterface>;
        stdout =
            stubInterface<OutputInterface>() as sinon.SinonStubbedInstance<OutputInterface>;
        stderr =
            stubInterface<OutputInterface>() as sinon.SinonStubbedInstance<OutputInterface>;

        binary = new TappetBinary(
            configFileDetector,
            initCommand,
            stdout,
            stderr,
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('run()', () => {
        it('should run the init command when the init subcommand is given', async () => {
            initCommand.run.resolves();

            const exitCode = await binary.run(['node', 'tappet', 'init']);

            expect(initCommand.run).to.have.been.calledOnce;
            expect(exitCode).to.equal(0);
        });

        it('should not check for a config file when the init subcommand is given', async () => {
            initCommand.run.resolves();

            await binary.run(['node', 'tappet', 'init']);

            expect(configFileDetector.exists).not.to.have.been.called;
        });

        it('should run the init command implicitly when no subcommand is given and no config file exists', async () => {
            configFileDetector.exists.returns(false);
            initCommand.run.resolves();

            const exitCode = await binary.run(['node', 'tappet']);

            expect(initCommand.run).to.have.been.calledOnce;
            expect(exitCode).to.equal(0);
        });

        it('should not run the init command when no subcommand is given but a config file exists', async () => {
            configFileDetector.exists.returns(true);

            const exitCode = await binary.run(['node', 'tappet']);

            expect(initCommand.run).not.to.have.been.called;
            expect(exitCode).to.equal(0);
        });

        it('should write a message to stdout when no subcommand is given and a config file exists', async () => {
            configFileDetector.exists.returns(true);

            await binary.run(['node', 'tappet']);

            expect(stdout.write).to.have.been.calledOnce;
            expect(stdout.write.firstCall.args[0]).to.include('configured');
        });

        it('should write an error message to stderr when an unknown subcommand is given', async () => {
            const exitCode = await binary.run([
                'node',
                'tappet',
                'unknown-cmd',
            ]);

            expect(stderr.write).to.have.been.called;
            expect(stderr.write.firstCall.args[0]).to.include(
                'Unknown command',
            );
            expect(exitCode).to.equal(1);
        });

        it('should include the unknown subcommand name in the error message', async () => {
            await binary.run(['node', 'tappet', 'unknown-cmd']);

            expect(stderr.write.firstCall.args[0]).to.include('unknown-cmd');
        });

        it('should write usage information to stderr when an unknown subcommand is given', async () => {
            await binary.run(['node', 'tappet', 'unknown-cmd']);

            expect(stderr.write).to.have.been.calledTwice;
            expect(stderr.write.secondCall.args[0]).to.include('Usage:');
        });
    });
});
