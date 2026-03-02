/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { Output } from '../../../src/Io/Output.ts';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Output', () => {
    let stream: sinon.SinonStubbedInstance<NodeJS.WriteStream>;
    let output: Output;

    beforeEach(() => {
        stream = {
            write: sinon.stub(),
        } as unknown as sinon.SinonStubbedInstance<NodeJS.WriteStream>;

        output = new Output(stream);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('write()', () => {
        it('should write the given data to the stream', () => {
            output.write('hello world\n');

            expect(stream.write.calledOnce).to.be.true;
            expect(stream.write.calledWith('hello world\n')).to.be.true;
        });

        it('should write an empty string to the stream', () => {
            output.write('');

            expect(stream.write.calledOnce).to.be.true;
            expect(stream.write.calledWith('')).to.be.true;
        });
    });
});
