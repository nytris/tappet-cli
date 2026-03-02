#!/usr/bin/env node
/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { ComposerChecker } from '../src/Process/ComposerChecker.js';
import { ComposerInstaller } from '../src/Installer/ComposerInstaller.js';
import { ConfigFileDetector } from '../src/Config/ConfigFileDetector.js';
import { ConfigFileWriter } from '../src/Config/ConfigFileWriter.js';
import { Filesystem } from '../src/Filesystem/Filesystem.js';
import { InitCommand } from '../src/Command/InitCommand.js';
import { NpmInstaller } from '../src/Installer/NpmInstaller.js';
import { Output } from '../src/Io/Output.js';
import { ProcessRunner } from '../src/Process/ProcessRunner.js';
import { Prompt } from '../src/Io/Prompt.js';
import { TappetBinary } from '../src/Bin/TappetBinary.js';

const filesystem = new Filesystem();
const stdout = new Output(process.stdout);
const stderr = new Output(process.stderr);
const processRunner = new ProcessRunner();
const composerChecker = new ComposerChecker(processRunner);
const composerInstaller = new ComposerInstaller(
    composerChecker,
    filesystem,
    processRunner,
    stderr,
);
const npmInstaller = new NpmInstaller(processRunner);
const configFileDetector = new ConfigFileDetector(filesystem);
const configFileWriter = new ConfigFileWriter(filesystem);
const prompt = new Prompt();
const initCommand = new InitCommand(
    composerInstaller,
    configFileDetector,
    configFileWriter,
    npmInstaller,
    prompt,
    stdout,
    stderr,
);
const tappetBinary = new TappetBinary(configFileDetector, initCommand, stdout, stderr);

const exitCode = await tappetBinary.run(process.argv);

process.exit(exitCode);
