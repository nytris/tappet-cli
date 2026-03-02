/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { InitialisationError } from '../Exception/InitialisationError.ts';
import { ProcessRunnerInterface } from '../Process/ProcessRunnerInterface.ts';
import { NpmInstallerInterface } from './NpmInstallerInterface.ts';

/**
 * Installs NPM packages using the `npm` CLI.
 */
export class NpmInstaller implements NpmInstallerInterface {
    constructor(private readonly processRunner: ProcessRunnerInterface) {}

    /**
     * @inheritDoc
     */
    install(packageName: string): void {
        const result = this.processRunner.run('npm', [
            'install',
            '--save-dev',
            packageName,
        ]);

        if (result.status !== 0) {
            throw new InitialisationError(
                `Failed to install ${packageName} via npm (exit code ${result.status}).`,
            );
        }
    }
}
