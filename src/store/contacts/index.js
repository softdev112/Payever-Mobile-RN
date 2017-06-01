import { observable, action } from 'mobx';
import { apiHelper, log } from 'utils';

import type { ContactsPaginationData } from '../../common/api/ContactsApi';
import type Store from './index';
import type CustomerContactInfo from './models/CustomerContactInfo';
import ContactsUI from './ui';

export default class ContactsStore {
  @observable contacts: Array<CustomerContactInfo> = [];
  contactsPaginationData: ContactsPaginationData = null;

  @observable contactGroups: Array<any> = [];
  contactGroupsPaginationData: ContactsPaginationData = null;

  @observable error: string     = '';
  @observable isLoading: boolean = false;

  @observable selectedContacts: Array<CustomerContactInfo> = [];
  @observable logoUploadingProgress: number = 0;

  @observable ui: ContactsUI = {};

  store: Store;

  constructor(store: Store) {
    this.store = store;

    this.ui = new ContactsUI();
  }

  @action
  loadAllContacts(options: LoadContactsOptions = { fromFirstPage: false }) {
    const { api, profiles } = this.store;
    let pageCount = 0;
    let currentPage = 0;

    if (this.contactsPaginationData && !options.fromFirstPage) {
      // pageCount - number, current - string
      pageCount = this.contactsPaginationData.pageCount;
      currentPage = +this.contactsPaginationData.current;

      if (pageCount === 0) return null;
    }

    if (this.isLoading || (currentPage !== 0 && currentPage === pageCount)) {
      return null;
    }

    if (options.fromFirstPage) {
      this.contactsPaginationData = null;
      this.contacts = [];
    }

    return apiHelper(
      api.contacts.getAllContacts(
        profiles.currentProfile.business.slug,
        currentPage + 1
      ),
      this
    ).success((data) => {
      this.contactsPaginationData = data.pagination_data;
      this.contacts = this.contacts.concat(data.contact_models);
    }).error(log.error)
      .promise();
  }

  @action
  loadAllContactGroups(
    options: LoadContactsOptions = { fromFirstPage: false }
  ) {
    const { api, profiles } = this.store;
    let pageCount = 0;
    let currentPage = 0;

    if (this.contactGroupsPaginationData && !options.fromFirstPage) {
      // pageCount - number, current - string
      pageCount = this.contactGroupsPaginationData.pageCount;
      currentPage = +this.contactGroupsPaginationData.current;

      if (pageCount === 0) return null;
    }

    if (this.isLoading || (currentPage !== 0 && currentPage === pageCount)) {
      return null;
    }

    if (options.fromFirstPage) {
      this.contactGroupsPaginationData = null;
      this.contactGroups = [];
    }

    return apiHelper(
      api.contacts.getAllContactGroups(
        profiles.currentProfile.business.slug,
        currentPage + 1
      ),
      this
    ).success((data) => {
      this.contactGroupsPaginationData = data.pagination_data;
      this.contactGroups = this.contactGroups.concat(data.group_list);
    }).error(log.error)
      .promise();
  }

  @action
  createNewContact(contact: CustomerContactInfo) {
    const { api } = this.store;

    const slug = this.store.profiles.currentProfile.business.slug;
    return apiHelper(api.contacts.createNewContact(contact, slug), this)
      .success(data => data)
      .error(log.error)
      .promise();
  }

  @action
  uploadContactLogo(mediaFileInfo) {
    this.logoUploadingProgress = 0;
    return this.store.api.contacts.uploadContactLogo(mediaFileInfo)
      .catch(log.error);
  }

  @action
  updateLogoUploadProgress(value: number) {
    this.logoUploadingProgress = 0;
    if (value >= 100) {
      this.logoUploadingProgress = 100;
    }
  }

  @action
  addContactToSelected(contact: CustomerContactInfo) {
    this.selectedContacts.push(contact);
  }

  @action
  removeContactFromSelected(id: number) {
    this.selectedContacts = this.selectedContacts.filter(c => c.id !== id);
  }

  @action
  clearSelectedContacts() {
    this.selectedContacts = [];
  }

  @action
  checkContactSelected(id: number) {
    return !!this.selectedContacts.find(c => c.id === id);
  }

  @action
  sendInviteMessage(contactId: number) {
    const { api } = this.store;

    return apiHelper(api.contacts.sendInviteMessage([contactId]), this)
      .success()
      .error(log.error)
      .promise();
  }
}

type LoadContactsOptions = {
  fromFirstPage: boolean;
};