export function useStrongPassword() {
  const pwdRules = [
    {
      message: '8 characters',
      regex: /^.{8,}$/,
    },
    {
      message: '1 lowercase letter',
      regex: /^(?=.*[a-z])/,
    },
    {
      message: '1 uppercase letter',
      regex: /^(?=.*[A-Z])/,
    },
    // {
    //   message: '1 special character',
    //   regex: /^(?=.*[@$!%*#?&.])/,
    // },
    {
      message: '1 digit',
      regex: /^(?=.*\d)/,
    },
  ]

  function constructErrorMessage(messages: string[]): string {
    return `${'Password should contain at least: '} ${messages.join('; ')}`
  }

  function verifyProvidedPassword(value: any) {
    const failedRequirements: string[] = []

    if (value) {
      pwdRules.forEach((rule) => {
        if (!rule.regex.test(value)) {
          failedRequirements.push(rule.message)
        }
      })

      if (failedRequirements.length > 0) {
        return constructErrorMessage(failedRequirements)
      }
    }
  }

  return {
    verifyProvidedPassword,
  }
}
