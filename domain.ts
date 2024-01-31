type Rule = {
  name: string,
  type: string,
  offenderSelector : string,
  offendingStyle?: string | undefined
  selectByClass?: boolean
  selectById?: boolean
  offendingClass?: string | undefined
  content?: string | undefined
  ariaLabel?: string | undefined
}

type TagRule = Pick<Rule, 'name' | 'type' | 'offenderSelector'>;

type ContentRule = Pick<Rule, 'name' | 'type' | 'offenderSelector' | 'content'>;

type AriaRule = Pick<Rule, 'name' | 'type' | 'offenderSelector' >;

type AriaTagRule = Pick<Rule, 'name' | 'type' | 'offenderSelector' | 'selectByClass' | 'ariaLabel'>;

type StyleRule = Pick<Rule, 'name' | 'type' | 'offenderSelector' | 'offendingStyle' | 'selectByClass'>;

type ClassRule = Pick <Rule, 'name' | 'type' | 'offenderSelector' | 'offendingClass'>

type RuleType = 'tag' | 'styleTag';

export type {Rule, StyleRule, TagRule, RuleType, ClassRule, ContentRule, AriaRule, AriaTagRule};