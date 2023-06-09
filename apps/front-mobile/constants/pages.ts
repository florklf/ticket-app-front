const ENUM_PAGE = {
  HOME_PAGE: 'HOME_PAGE',
  CONCERTS_PAGE: 'CONCERTS_PAGE',
  SIGNIN_PAGE: 'SIGNIN_PAGE',
  SIGNUP_PAGE: 'SIGNUP_PAGE',
  PRIVACY_POLICY_PAGE: 'PRIVACY_POLICY_PAGE',
  LEGAL_NOTICE_PAGE: 'LEGAL_NOTICE_PAGE',
  NOT_FOUND_PAGE: 'NOT_FOUND_PAGE'
}

export const PATH = {
  [ENUM_PAGE.HOME_PAGE]: '/',
  [ENUM_PAGE.CONCERTS_PAGE]: '/concerts',
  [ENUM_PAGE.SIGNIN_PAGE]: '/signin',
  [ENUM_PAGE.SIGNUP_PAGE]: '/signup',
  [ENUM_PAGE.PRIVACY_POLICY_PAGE]: '/privacy-policy',
  [ENUM_PAGE.LEGAL_NOTICE_PAGE]: '/legal-notice'
}

export const TITLE = {
  [ENUM_PAGE.HOME_PAGE]: null,
  [ENUM_PAGE.CONCERTS_PAGE]: 'Concerts',
  [ENUM_PAGE.SIGNIN_PAGE]: 'Connexion',
  [ENUM_PAGE.SIGNUP_PAGE]: 'Inscription',
  [ENUM_PAGE.PRIVACY_POLICY_PAGE]: 'Politique de confidentialité',
  [ENUM_PAGE.LEGAL_NOTICE_PAGE]: 'Mentions légales',
  [ENUM_PAGE.NOT_FOUND_PAGE]: 'Page non trouvée'
}

export default { PATH, TITLE }