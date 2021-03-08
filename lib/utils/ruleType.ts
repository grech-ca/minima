import { ruleType, FieldShieldResolver } from 'nexus-shield';

type RuleTypeParameters = Parameters<typeof ruleType>;

type ShieldRuleConfig = RuleTypeParameters[0];

export type WrappedRuleType<TypeName extends string, FieldName extends string> = () => FieldShieldResolver<
  TypeName,
  FieldName
>;

type RuleType = <TypeName extends string, FieldName extends string>(
  config: ShieldRuleConfig,
) => FieldShieldResolver<TypeName, FieldName>;

const wrappedRuleType = ((config: ShieldRuleConfig) => ruleType(config)) as RuleType;

export default wrappedRuleType;
