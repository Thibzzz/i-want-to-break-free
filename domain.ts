type Rule = {
  name: string,
  type: string,
  offenderSelector : string,
  offendingStyle?: string | undefined
  selectByClass?: boolean
  selectById?: boolean
  offendingClass?: string | undefined
}

type TagRule = Pick<Rule, 'name' | 'type' | 'offenderSelector'>;

type StyleRule = Pick<Rule, 'name' | 'type' | 'offenderSelector' | 'offendingStyle' | 'selectByClass'>;

type ClassRule = Pick <Rule, 'name' | 'type' | 'offenderSelector' | 'offendingClass'>

type RuleType = 'tag' | 'styleTag';

export type {Rule, StyleRule, TagRule, RuleType, ClassRule};