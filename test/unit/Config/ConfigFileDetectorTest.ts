/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { ConfigFileDetector } from '../../../src/Config/ConfigFileDetector.ts';
import { FilesystemInterface } from '../../../src/Filesystem/FilesystemInterface.ts';
import { expect } from 'chai';
import { join } from 'path';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';

describe('ConfigFileDetector', () => {
    let filesystem: sinon.SinonStubbedInstance<FilesystemInterface>;
    let detector: ConfigFileDetector;
    let cwd: string;

    beforeEach(() => {
        filesystem =
            stubInterface<FilesystemInterface>() as sinon.SinonStubbedInstance<FilesystemInterface>;

        cwd = process.cwd();

        filesystem.existsSync.returns(false);

        detector = new ConfigFileDetector(filesystem);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('exists()', () => {
        it('should return false when neither config file exists', () => {
            filesystem.existsSync.returns(false);

            expect(detector.exists()).to.be.false;
        });

        it('should return true when tappet.config.js exists', () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'tappet.config.js'))
                .returns(true);

            expect(detector.exists()).to.be.true;
        });

        it('should return true when tappet.config.php exists', () => {
            filesystem.existsSync
                .withArgs(join(cwd, 'tappet.config.js'))
                .returns(false);
            filesystem.existsSync
                .withArgs(join(cwd, 'tappet.config.php'))
                .returns(true);

            expect(detector.exists()).to.be.true;
        });

        it('should check for tappet.config.js in the current working directory', () => {
            detector.exists();

            expect(filesystem.existsSync).to.have.been.calledWith(
                join(cwd, 'tappet.config.js'),
            );
        });

        it('should check for tappet.config.php in the current working directory', () => {
            detector.exists();

            expect(filesystem.existsSync).to.have.been.calledWith(
                join(cwd, 'tappet.config.php'),
            );
        });
    });
});
