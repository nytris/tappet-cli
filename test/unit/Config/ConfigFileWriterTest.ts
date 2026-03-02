/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { ConfigFileWriter } from '../../../src/Config/ConfigFileWriter.ts';
import { FilesystemInterface } from '../../../src/Filesystem/FilesystemInterface.ts';
import { expect } from 'chai';
import { join } from 'path';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';

describe('ConfigFileWriter', () => {
    let filesystem: sinon.SinonStubbedInstance<FilesystemInterface>;
    let writer: ConfigFileWriter;

    beforeEach(() => {
        filesystem =
            stubInterface<FilesystemInterface>() as sinon.SinonStubbedInstance<FilesystemInterface>;

        writer = new ConfigFileWriter(filesystem);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('write()', () => {
        it('should write the config file to the current working directory', () => {
            writer.write('cypress');

            expect(filesystem.writeFileSync).to.have.been.calledOnce;
            expect(filesystem.writeFileSync.firstCall.args[0]).to.equal(
                join(process.cwd(), 'tappet.config.js'),
            );
            expect(filesystem.writeFileSync.firstCall.args[2]).to.equal('utf8');
        });

        it('should include the adapter name in the config file contents', () => {
            writer.write('cypress');

            const contents = filesystem.writeFileSync.firstCall
                .args[1] as string;
            expect(contents).to.include('cypress');
        });

        it('should include a reference to the adapter package type in the config contents', () => {
            writer.write('cypress');

            const contents = filesystem.writeFileSync.firstCall
                .args[1] as string;
            expect(contents).to.include('@tappet/cypress');
        });

        it('should write a valid JavaScript export default statement', () => {
            writer.write('cypress');

            const contents = filesystem.writeFileSync.firstCall
                .args[1] as string;
            expect(contents).to.include('export default');
        });
    });
});
