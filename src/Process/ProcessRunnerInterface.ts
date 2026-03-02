/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { ProcessResult } from './ProcessResult.ts';
import { ProcessRunOptions } from './ProcessRunOptions.ts';

/**
 * Interface for running external processes.
 */
export interface ProcessRunnerInterface {
    /**
     * Runs an external process synchronously.
     *
     * @param command The command to run.
     * @param args Arguments to pass to the command.
     * @param options Optional process run options.
     * @returns The process result.
     */
    run(
        command: string,
        args: string[],
        options?: ProcessRunOptions,
    ): ProcessResult;
}
