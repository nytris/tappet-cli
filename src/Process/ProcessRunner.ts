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
import { ProcessRunnerInterface } from './ProcessRunnerInterface.ts';
import { spawnSync } from 'child_process';

/**
 * Runs external processes using spawnSync, with cross-platform support.
 */
export class ProcessRunner implements ProcessRunnerInterface {
    /**
     * @inheritDoc
     */
    run(
        command: string,
        args: string[],
        options: ProcessRunOptions = {},
    ): ProcessResult {
        const stdio = options.stdio ?? 'inherit';

        const result = spawnSync(command, args, {
            // Use shell mode on Windows so that npm, composer etc. can be found.
            shell: process.platform === 'win32',
            stdio,
        });

        return { status: result.status };
    }
}
