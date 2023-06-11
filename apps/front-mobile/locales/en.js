export default {
  navbar: {
    home: 'Home',
    concert: 'Concerts',
    signin: 'I sign in',
    signout: 'I sign out',
    dashboard: 'Dashboard'
  },
  footer: {
    rights: 'All rights reserved'
  },
  signin: {
    title: 'Welcome Back 🤘',
    subtitle: 'You are not a member yet?',
    signup: 'Join us',
    forgot: 'Forgot password?',
    error: {
      generic: 'An error occurred while logging in. Please check the information entered.'
    },
    submit: 'I sign in'
  },
  signup: {
    title: 'Welcome 🤘',
    subtitle: 'You are already a member?',
    signin: 'Sign in',
    submit: 'Join',
    error: {
      email: 'This email is already used.',
      generic: 'An error occurred'
    },
    firstname: 'Firstname',
    lastname: 'Lastname',
    password: 'Password',
    passwordConfirm: 'Confirm password'
  },
  home: {
    title: 'Home',
    events: {
      title: 'Next {next_events} to come',
      next: 'events'
    },
    hero: {
      heading: 'Discover your {heading_gradient} concert',
      heading_gradient: 'next unforgettable',
      searchPlaceholder: 'Search for an event, an artist, a genre, a place...',
      searchResults: 'Search results',
      searchResultsCount: '{count} event|{count} events',
      emptySearchMessage: 'No results for this search.',
      searchResultsMore: 'See more...',
      searchResultsSee: 'See results'
    }
  },
  concert: {
    title: 'Concerts',
    reservation: {
      title: 'Select your seats',
      seeCategories: 'Which category should I choose?',
      addToCart: 'Add to cart',
      addToCartNotConnected: 'You must be logged in to add seats to your cart.',
      modalAvailableSeatType: 'Available seat categories'
    },
    details: {
      description: 'Event description',
      inLineUp: 'In the lineup',
      place: 'Place'
    }
  },
  search: {
    title: 'Results for "{query}"',
    noResults: 'No results for this search.',
    resultsCount: '{count} result|{count} results'
  },
  dashboard: {
    title: 'Dashboard',
    order: {
      title: 'Order',
      at: 'at',
      orderList: {
        title: 'My orders',
        empty: 'You have no orders yet.',
        billingAddress: 'Billing address',
        shippingAddress: 'Shipping address',
        buyingDate: 'Buying date',
        seatType: 'Seat type',
        price: 'Price',
        quantity: 'Quantity',
        quantityLabel: 'ticket(s)',
        totalPrice: 'Total price',
        qrCode: 'QR Code',
        qrCodeModal: {
          title: 'Tickets display',
          description: 'Please present this QR Code at the entrance of the event.',
          ticket: 'Ticket'
        },
        payment: {
          title: 'Payment',
          paymentMethod: 'Payment method',
          paymentStatus: 'Payment status',
          cardNumber: 'Card number',
          paymentDate: 'Payment date'
        },
        event: {
          title: 'Événement',
          date: 'See you on'
        },
        place: {
          title: 'Place',
          addressReminder: 'Even better with the address uh?'
        }
      }
    },
    profile: {
      title: 'Profile'
    }
  }
}
