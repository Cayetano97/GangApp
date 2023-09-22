import {Store} from 'pullstate';

interface UIStore {
  user: {
    firstName: string;
    lastName: string;
    acceptedTnC: boolean;
  };
  preferences: {
    isDarkMode: boolean;
    pushNotifications: boolean;
  };
  list: {
    create: {
        id: string;
        status: string;
    }
  };
}

const initialStore: UIStore = {
  user: {
    firstName: '',
    lastName: '',
    acceptedTnC: false,
  },
  preferences: {
    isDarkMode: false,
    pushNotifications: false,
  },
  list: {
    create: {
        id: '',
        status: ''
    }
  }
};

export const store = new Store<UIStore>({
  user: {
    firstName: '',
    lastName: '',
    acceptedTnC: false,
  },
  preferences: {
    isDarkMode: false,
    pushNotifications: false,
  },
  list: {
    create: {
        id: '',
        status: ''
    }
  }
});
