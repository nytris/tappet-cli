/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { FilesystemInterface } from '../Filesystem/FilesystemInterface.ts';
import { ConfigFileWriterInterface } from './ConfigFileWriterInterface.ts';
import { join } from 'path';

const buildConfigContents = (adapter: string): string =>
    `/** @type {import('@tappet/${adapter}').TappetConfig} */
export default {
    adapter: '${adapter}',
};
`;

/**
 * Writes the Tappet config file to the current working directory.
 */
export class ConfigFileWriter implements ConfigFileWriterInterface {
    constructor(private readonly filesystem: FilesystemInterface) {}

    /**
     * @inheritDoc
     */
    write(adapter: string): void {
        const configPath = join(process.cwd(), 'tappet.config.js');

        this.filesystem.writeFileSync(
            configPath,
            buildConfigContents(adapter),
            'utf8',
        );
    }
}
