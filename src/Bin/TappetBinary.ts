/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { InitCommandInterface } from '../Command/InitCommandInterface.ts';
import { ConfigFileDetectorInterface } from '../Config/ConfigFileDetectorInterface.ts';
import { OutputInterface } from '../Io/OutputInterface.ts';
import { TappetBinaryInterface } from './TappetBinaryInterface.ts';

/**
 * Main binary for the Tappet CLI.
 */
export class TappetBinary implements TappetBinaryInterface {
    constructor(
        private readonly configFileDetector: ConfigFileDetectorInterface,
        private readonly initCommand: InitCommandInterface,
        private readonly stdout: OutputInterface,
        private readonly stderr: OutputInterface,
    ) {}

    /**
     * @inheritDoc
     */
    async run(args: string[]): Promise<number> {
        const [, , subcommand] = args;

        if (subcommand === 'init') {
            await this.initCommand.run();
            return 0;
        }

        if (subcommand !== undefined) {
            this.stderr.write(`Unknown command: ${subcommand}\n`);
            this.stderr.write('Usage: tappet [init]\n');
            return 1;
        }

        // No subcommand given; run init implicitly if no config file exists.
        if (!this.configFileDetector.exists()) {
            await this.initCommand.run();
            return 0;
        }

        this.stdout.write(
            'Tappet is configured. Use your adapter-specific test command to run tests.\n',
        );
        return 0;
    }
}
