/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { Adapter } from '../Adapter/Adapter.ts';
import { PromptInterface } from './PromptInterface.ts';
import { select } from '@inquirer/prompts';

/**
 * Handles interactive CLI prompts using @inquirer/prompts.
 */
export class Prompt implements PromptInterface {
    /**
     * @inheritDoc
     */
    async chooseAdapter(adapters: Adapter[]): Promise<string> {
        return select({
            choices: adapters.map((a) => ({ name: a.label, value: a.value })),
            message: 'Which testing adapter would you like to use?',
        });
    }
}
