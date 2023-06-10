export default {
  navbar: {
    home: 'Accueil',
    concert: 'Concerts',
    signin: 'Je me connecte',
    signout: 'Je me déconnecte',
    dashboard: 'Dashboard'
  },
  footer: {
    rights: 'Tous droits réservés'
  },
  signin: {
    title: 'Welcome Back 🤘',
    subtitle: 'Vous n\'êtes pas encore membre ?',
    signup: 'Rejoignez-nous',
    forgot: 'Mot de passe oublié ?',
    error: 'Une erreur est survenue lors de la connexion. Veuillez vérifier les informations saisies.',
    submit: 'Je me connecte'
  },
  signup: {
    title: 'Welcome 🤘',
    subtitle: 'Vous êtes déjà membre ?',
    signin: 'Connectez-vous',
    submit: 'Rejoindre',
    error: {
      email: 'Cet email est déjà utilisé.',
      generic: 'Une erreur est survenue'
    },
    password: 'Mot de passe',
    passwordConfirm: 'Confirmer le mot de passe'
  },
  home: {
    title: 'Accueil',
    events: {
      title: 'Les {next_events} à venir',
      next: 'prochains événements'
    },
    hero: {
      heading: 'Découvrez votre {heading_gradient} inoubliable',
      heading_gradient: 'prochain concert',
      searchPlaceholder: 'Rechercher un événement, un artiste, un genre, un lieu...'
    }
  },
  concert: {
    title: 'Concerts',
    reservation: {
      title: 'Sélectionnez vos places',
      seeCategories: 'Quelle catégorie devrais-je choisir ?',
      addToCart: 'Ajouter au panier',
      addToCartNotConnected: 'Vous devez être connecté pour ajouter des places à votre panier.',
      modalAvailableSeatType: 'Catégories de places disponibles'
    },
    details: {
      description: 'Description de l\'événement',
      place: 'Emplacement'
    }
  },
  dashboard: {
    title: 'Dashboard',
    order: {
      title: 'Commande',
      at: 'à',
      orderList: {
        title: 'Mes commandes',
        empty: 'Vous n\'avez pas encore passé de commande.',
        billingAddress: 'Adresse de facturation',
        shippingAddress: 'Adresse de livraison',
        buyingDate: 'Date d\'achat',
        seatType: 'Type de place',
        price: 'Prix',
        quantity: 'Quantité',
        quantityLabel: 'billet(s)',
        totalPrice: 'Prix total',
        qrCode: 'QR Code',
        qrCodeModal: {
          title: 'Affichage des billets',
          description: 'Veuillez présenter ce QR Code à l\'entrée de l\'événement.',
          ticket: 'Billet'
        },
        payment: {
          title: 'Paiement',
          paymentMethod: 'Méthode de paiement',
          paymentStatus: 'Statut du paiement',
          cardNumber: 'Numéro de carte',
          paymentDate: 'Date de paiement'
        },
        event: {
          title: 'Événement',
          date: 'Rendez-vous le'
        },
        place: {
          title: 'Lieu',
          addressReminder: 'Avec l\'adresse, c\'est toujours mieux !'
        }
      }
    },
    profile: {
      title: 'Profil'
    }
  }
}
