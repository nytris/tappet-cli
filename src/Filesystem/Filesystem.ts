/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { FilesystemInterface } from './FilesystemInterface.ts';
import { existsSync, readFileSync, writeFileSync } from 'fs';

/**
 * Wraps Node.js filesystem operations.
 */
export class Filesystem implements FilesystemInterface {
    /**
     * @inheritDoc
     */
    existsSync(path: string): boolean {
        return existsSync(path);
    }

    /**
     * @inheritDoc
     */
    readFileSync(path: string, encoding: BufferEncoding): string {
        return readFileSync(path, { encoding }) as string;
    }

    /**
     * @inheritDoc
     */
    writeFileSync(path: string, data: string, encoding: BufferEncoding): void {
        writeFileSync(path, data, { encoding });
    }
}
