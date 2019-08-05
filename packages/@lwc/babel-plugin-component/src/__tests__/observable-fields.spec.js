/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const pluginTest = require('./utils/test-transform').pluginTest(require('../index'));

describe('observable fields', () => {
    pluginTest(
        'transform non lwc decorated values to track when no prop is tracked',
        `
        import { api, wire, track, createElement } from 'lwc';
        export default class Test {
            state;
            @track foo;
            @track bar;
            
            @api label;
            
            record = {
                value: 'test'
            };
            
            @api
            someMethod() {}
            
            @wire(createElement) wiredProp;
        }
    `,
        {
            output: {
                code: `
                import { registerDecorators as _registerDecorators } from "lwc";
                import _tmpl from "./test.html";
                import { registerComponent as _registerComponent } from "lwc";
                import { createElement } from "lwc";
                
                class Test {
                  constructor() {
                    this.state = void 0;
                    this.foo = void 0;
                    this.bar = void 0;
                    this.label = void 0;
                    this.record = {
                      value: "test"
                    };
                    this.wiredProp = void 0;
                  }
                
                  someMethod() {}
                }
                
                _registerDecorators(Test, {
                  publicProps: {
                    label: {
                      config: 0
                    }
                  },
                  publicMethods: ["someMethod"],
                  wire: {
                    wiredProp: {
                      adapter: createElement
                    }
                  },
                  track: {
                    foo: 1,
                    bar: 1
                  }
                });
                
                export default _registerComponent(Test, {
                  tmpl: _tmpl,
                  observedFields: ["state", "record"]
                });
                `,
            },
        }
    );
});
