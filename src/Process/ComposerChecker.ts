/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { ComposerCheckerInterface } from './ComposerCheckerInterface.ts';
import { ProcessRunnerInterface } from './ProcessRunnerInterface.ts';

/**
 * Checks whether Composer is available on the system.
 */
export class ComposerChecker implements ComposerCheckerInterface {
    constructor(private readonly processRunner: ProcessRunnerInterface) {}

    /**
     * @inheritDoc
     */
    isAvailable(): boolean {
        const result = this.processRunner.run('composer', ['--version'], {
            stdio: 'pipe',
        });

        return result.status === 0;
    }
}
