/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { InitialisationError } from '../Exception/InitialisationError.ts';
import { FilesystemInterface } from '../Filesystem/FilesystemInterface.ts';
import { OutputInterface } from '../Io/OutputInterface.ts';
import { ComposerCheckerInterface } from '../Process/ComposerCheckerInterface.ts';
import { ProcessRunnerInterface } from '../Process/ProcessRunnerInterface.ts';
import { ComposerInstallerInterface } from './ComposerInstallerInterface.ts';
import { join } from 'path';

/**
 * Installs Composer packages using the `composer` CLI.
 */
export class ComposerInstaller implements ComposerInstallerInterface {
    constructor(
        private readonly composerChecker: ComposerCheckerInterface,
        private readonly filesystem: FilesystemInterface,
        private readonly processRunner: ProcessRunnerInterface,
        private readonly stderr: OutputInterface,
    ) {}

    /**
     * @inheritDoc
     */
    async ensureInstalled(packageName: string): Promise<void> {
        if (this.isInstalled(packageName)) {
            return;
        }

        if (!this.composerChecker.isAvailable()) {
            this.stderr.write(
                `Warning: Composer is not available. Skipping installation of ${packageName}.\n`,
            );
            return;
        }

        const result = this.processRunner.run('composer', [
            'require',
            '--dev',
            packageName,
        ]);

        if (result.status !== 0) {
            throw new InitialisationError(
                `Failed to install ${packageName} via Composer (exit code ${result.status}).`,
            );
        }
    }

    /**
     * @inheritDoc
     */
    isInstalled(packageName: string): boolean {
        const cwd = process.cwd();
        const composerLockPath = join(cwd, 'composer.lock');

        if (this.filesystem.existsSync(composerLockPath)) {
            const lock = JSON.parse(
                this.filesystem.readFileSync(composerLockPath, 'utf8'),
            ) as {
                packages?: Array<{ name: string }>;
                'packages-dev'?: Array<{ name: string }>;
            };
            const allPackages = [
                ...(lock.packages ?? []),
                ...(lock['packages-dev'] ?? []),
            ];

            return allPackages.some((p) => p.name === packageName);
        }

        const composerJsonPath = join(cwd, 'composer.json');

        if (this.filesystem.existsSync(composerJsonPath)) {
            const composerJson = JSON.parse(
                this.filesystem.readFileSync(composerJsonPath, 'utf8'),
            ) as {
                require?: Record<string, string>;
                'require-dev'?: Record<string, string>;
            };
            const allDeps = {
                ...(composerJson.require ?? {}),
                ...(composerJson['require-dev'] ?? {}),
            };

            return packageName in allDeps;
        }

        return false;
    }
}
