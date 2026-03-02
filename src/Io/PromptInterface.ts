/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import { Adapter } from '../Adapter/Adapter.ts';

/**
 * Interface for interactive CLI prompts.
 */
export interface PromptInterface {
    /**
     * Prompts the user to choose a testing adapter.
     *
     * @param adapters The available adapters to choose from.
     * @returns The value of the chosen adapter.
     */
    chooseAdapter(adapters: Adapter[]): Promise<string>;
}
