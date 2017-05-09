import { add } from '@/utils/add'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

describe('add', () => {
  it('should have correct result', () => {
    const result = add(1,1){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
    expect(result)
      .to.equal(2){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
  }){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
