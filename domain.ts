type Rule = {
  name: string,
  type: string,
  offenderSelector : string,
  offendingStyle?: string | undefined
  selectByClass?: boolean
  selectById?: boolean
}

type TagRule = Pick<Rule, 'name' | 'type' | 'offenderSelector'>;

type StyleRule = Pick<Rule, 'name' | 'type' | 'offenderSelector' | 'offendingStyle' | 'selectByClass'>;

type RuleType = 'tag' | 'styleTag';

export type {Rule, StyleRule, TagRule, RuleType};