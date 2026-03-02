/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { ComposerChecker } from '../../../src/Process/ComposerChecker.ts';
import { ProcessRunnerInterface } from '../../../src/Process/ProcessRunnerInterface.ts';
import { expect } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';

describe('ComposerChecker', () => {
    let processRunner: sinon.SinonStubbedInstance<ProcessRunnerInterface>;
    let checker: ComposerChecker;

    beforeEach(() => {
        processRunner =
            stubInterface<ProcessRunnerInterface>() as sinon.SinonStubbedInstance<ProcessRunnerInterface>;

        checker = new ComposerChecker(processRunner);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('isAvailable()', () => {
        it('should return true when composer --version exits with status 0', () => {
            processRunner.run.returns({ status: 0 });

            expect(checker.isAvailable()).to.be.true;
        });

        it('should return false when composer --version exits with a non-zero status', () => {
            processRunner.run.returns({ status: 1 });

            expect(checker.isAvailable()).to.be.false;
        });

        it('should return false when the process exits with a null status', () => {
            processRunner.run.returns({ status: null });

            expect(checker.isAvailable()).to.be.false;
        });

        it('should run composer with the --version argument', () => {
            processRunner.run.returns({ status: 0 });

            checker.isAvailable();

            expect(processRunner.run).to.have.been.calledWith('composer', [
                '--version',
            ]);
        });

        it('should use pipe stdio to suppress output when checking availability', () => {
            processRunner.run.returns({ status: 0 });

            checker.isAvailable();

            expect(processRunner.run.firstCall.args[2]).to.deep.equal({
                stdio: 'pipe',
            });
        });
    });
});
