/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */
import prettierConfig from 'buildbelt/prettier.config.mjs';

export default {
    ...prettierConfig,
    'plugins': ['@trivago/prettier-plugin-sort-imports'],
};
