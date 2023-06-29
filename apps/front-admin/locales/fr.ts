import { EnumTimeScope } from '~/types/EnumTimeScope'
export default {
  event: {
    status: {
      AVAILABLE: 'Disponible',
      UNAVAILABLE: 'Indisponible',
      SOLD_OUT: 'Complet',
      PAST: 'Passé'
    }
  },
  payment: {
    method: {
      CreditCard: 'Carte bancaire'
    }
  },
  timeScope: {
    [EnumTimeScope.ALL]: 'Tout le temps',
    [EnumTimeScope.DAY]: 'Jour',
    [EnumTimeScope.WEEK]: 'Semaine',
    [EnumTimeScope.MONTH]: 'Mois',
    [EnumTimeScope.YEAR]: 'Année'
  },
  index: {
    infoCard: {
      body: {
        [EnumTimeScope.ALL]: ' par rapport au mois dernier',
        [EnumTimeScope.DAY]: ' par rapport à hier',
        [EnumTimeScope.WEEK]: ' par rapport à la semaine dernière',
        [EnumTimeScope.MONTH]: ' par rapport au mois dernier',
        [EnumTimeScope.YEAR]: ' par rapport à l\'année dernière'
      }
    },
    orderTable: {
      header: {
        [EnumTimeScope.ALL]: 'Commandes',
        [EnumTimeScope.DAY]: 'Commandes du jour',
        [EnumTimeScope.WEEK]: 'Commandes de la semaine',
        [EnumTimeScope.MONTH]: 'Commandes du mois',
        [EnumTimeScope.YEAR]: 'Commandes de l\'année'
      }
    }
  }
}
