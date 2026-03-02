/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { FilesystemInterface } from '../Filesystem/FilesystemInterface.ts';
import { ConfigFileDetectorInterface } from './ConfigFileDetectorInterface.ts';
import { join } from 'path';

/**
 * Detects whether a Tappet config file exists in the current working directory.
 */
export class ConfigFileDetector implements ConfigFileDetectorInterface {
    constructor(private readonly filesystem: FilesystemInterface) {}

    /**
     * @inheritDoc
     */
    exists(): boolean {
        const cwd = process.cwd();

        return (
            this.filesystem.existsSync(join(cwd, 'tappet.config.js')) ||
            this.filesystem.existsSync(join(cwd, 'tappet.config.php'))
        );
    }
}
