/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { Adapter } from '../Adapter/Adapter.ts';
import { ConfigFileDetectorInterface } from '../Config/ConfigFileDetectorInterface.ts';
import { ConfigFileWriterInterface } from '../Config/ConfigFileWriterInterface.ts';
import { ComposerInstallerInterface } from '../Installer/ComposerInstallerInterface.ts';
import { NpmInstallerInterface } from '../Installer/NpmInstallerInterface.ts';
import { OutputInterface } from '../Io/OutputInterface.ts';
import { PromptInterface } from '../Io/PromptInterface.ts';
import { InitCommandInterface } from './InitCommandInterface.ts';

const ADAPTERS: Adapter[] = [
    {
        label: 'Cypress',
        npmPackage: '@tappet/cypress',
        value: 'cypress',
    },
    // Playwright and Symfony Panther support coming soon.
];

/**
 * Initialises the Tappet configuration for the current project.
 */
export class InitCommand implements InitCommandInterface {
    constructor(
        private readonly composerInstaller: ComposerInstallerInterface,
        private readonly configFileDetector: ConfigFileDetectorInterface,
        private readonly configFileWriter: ConfigFileWriterInterface,
        private readonly npmInstaller: NpmInstallerInterface,
        private readonly prompt: PromptInterface,
        private readonly stdout: OutputInterface,
        private readonly stderr: OutputInterface,
    ) {}

    /**
     * @inheritDoc
     */
    async run(): Promise<void> {
        this.stdout.write(
            "Welcome to Tappet! Let's set up your GUI testing environment.\n\n",
        );

        if (this.configFileDetector.exists()) {
            this.stderr.write(
                'Warning: a Tappet config file already exists. Re-running init will overwrite it.\n\n',
            );
        }

        // Prompt the user to choose their testing adapter.
        const adapterValue = await this.prompt.chooseAdapter(ADAPTERS);
        const adapter = ADAPTERS.find((a) => a.value === adapterValue)!;

        // Install the adapter NPM package.
        this.stdout.write(`\nInstalling ${adapter.npmPackage} ...\n`);
        this.npmInstaller.install(adapter.npmPackage);

        // Always ensure nytris/tappet is installed via Composer.
        await this.composerInstaller.ensureInstalled('nytris/tappet');

        // Write the config file.
        this.configFileWriter.write(adapter.value);

        this.stdout.write(
            `\nTappet is set up with the ${adapter.label} adapter.\n`,
        );
        this.stdout.write('Config written to tappet.config.js.\n');
    }
}
