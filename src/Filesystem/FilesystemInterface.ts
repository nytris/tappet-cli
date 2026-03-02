/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Interface for filesystem operations.
 */
export interface FilesystemInterface {
    /**
     * Checks whether a file or directory exists at the given path.
     */
    existsSync(path: string): boolean;

    /**
     * Reads the contents of a file synchronously.
     */
    readFileSync(path: string, encoding: BufferEncoding): string;

    /**
     * Writes data to a file synchronously.
     */
    writeFileSync(path: string, data: string, encoding: BufferEncoding): void;
}
