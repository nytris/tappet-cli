/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { OutputInterface } from './OutputInterface.ts';

/**
 * Standard output abstraction.
 */
export class Output implements OutputInterface {
    constructor(private readonly stream: NodeJS.WriteStream) {}

    /**
     * @inheritDoc
     */
    write(data: string): void {
        this.stream.write(data);
    }
}
