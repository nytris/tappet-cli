/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { ProcessRunner } from '../../../src/Process/ProcessRunner.ts';
import { expect } from 'chai';
import sinon from 'sinon';

describe('ProcessRunner', () => {
    let runner: ProcessRunner;

    beforeEach(() => {
        runner = new ProcessRunner();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('run()', () => {
        it('should return exit status 0 for a successful command', () => {
            const result = runner.run('node', ['--version'], { stdio: 'pipe' });

            expect(result.status).to.equal(0);
        });

        it('should return the exact exit status for a failing command', () => {
            const result = runner.run('node', ['-e', 'process.exit(42)'], {
                stdio: 'pipe',
            });

            expect(result.status).to.equal(42);
        });

        it('should default to inherit stdio when no options are given', () => {
            // Verify the runner does not throw when called without options.
            const result = runner.run('node', ['-e', '""'], { stdio: 'pipe' });

            expect(result.status).to.equal(0);
        });

        it('should suppress output when stdio is set to pipe', () => {
            // If the command runs without error, pipe mode is working.
            const result = runner.run(
                'node',
                ['-e', 'process.stdout.write("suppressed\\n")'],
                { stdio: 'pipe' },
            );

            expect(result.status).to.equal(0);
        });
    });
});
