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

  // Contacts UI
  @observable ui: ContactsUI = {};

  // eslint-disable-next-line flowtype/no-primitive-constructor-types
  contactGroupsCache: Map<Number, Object> = new Map();

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
      api.contacts.getAllContacts.bind(
        api.contacts,
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
      api.contacts.getAllContactGroups.bind(
        api.contacts,
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
  getGroupDetails(groupId: number) {
    const { contacts } = this.store.api;
    return apiHelper(contacts.getGroupDetails.bind(contacts, groupId))
      .success(data => data)
      .error(log.error)
      .promise();
  }

  @action
  createNewContact(contact: CustomerContactInfo) {
    const { contacts } = this.store.api;

    const slug = this.store.profiles.currentProfile.business.slug;
    return apiHelper(
      contacts.createNewContact.bind(contacts, contact, slug),
      this
    ).success(data => data)
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
    if (!this.checkContactSelected(contact.id)) {
      this.selectedContacts.push(contact);
    }
  }

  @action
  removeContactFromSelected(id: number) {
    this.selectedContacts = this.selectedContacts.filter(c => c.id !== id);
  }

  @action
  clearSelectedContacts() {
    this.selectedContacts = [];
    this.contactGroupsCache.clear();
  }

  @action
  checkContactSelected(id: number) {
    return !!this.selectedContacts.find(c => c.id === id);
  }

  @action
  async addContactsFromGroupToSelected(groupId: number) {
    let groupDetails = this.contactGroupsCache.get(groupId);
    if (!groupDetails) {
      groupDetails = await this.getGroupDetails(groupId);
      this.contactGroupsCache.set(groupId, groupDetails);
    }

    if (!groupDetails || !groupDetails.contact_models) return;

    groupDetails.contact_models.forEach(c => this.addContactToSelected(c));
  }

  @action
  async removeContactsGroupFromSelected(groupId: number) {
    let groupDetails = this.contactGroupsCache.get(groupId);
    if (!groupDetails) {
      groupDetails = await this.getGroupDetails(groupId);
      this.contactGroupsCache.set(groupId, groupDetails);
    }

    if (!groupDetails || !groupDetails.contact_models) return;

    groupDetails.contact_models.forEach(
      c => this.removeContactFromSelected(c.id)
    );
  }

  @action
  sendInviteMessage(contactId: number) {
    const { contacts } = this.store.api;

    return apiHelper(
      contacts.sendInviteMessage.bind(contacts, [contactId]),
      this
    ).success()
      .error(log.error)
      .promise();
  }
}

type LoadContactsOptions = {
  fromFirstPage: boolean;
};