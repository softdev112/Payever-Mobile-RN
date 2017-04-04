import { computed, observable, action } from 'mobx';
import { apiHelper } from 'utils';
import { DataSource } from 'ui';

import type {
  ProfilesData, ContactsPaginationData,
} from '../../common/api/ProfilesApi';
import type { MenuItemData } from '../../common/api/MenuApi';
import type { ActivityItemData } from '../../common/api/BusinessApi';
import type Store from './index';
import type SavedContact from './models/SavedContact';
import ActivityItem from './models/ActivityItem';
import AppItem from './models/AppItem';
import BusinessProfile from './models/BusinessProfile';
import PersonalProfile from './models/PersonalProfile';
import Profile from './models/Profile';

export default class ProfilesStore {
  @observable ownBusinesses: Array<BusinessProfile>   = [];
  @observable staffBusinesses: Array<BusinessProfile> = [];
  @observable privateProfile: PersonalProfile         = null;

  @observable currentProfile: PersonalProfile | BusinessProfile = null;
  @observable contacts: Array<SavedContact> = [];
  contactsPaginationData: ContactsPaginationData;

  @observable error: string     = '';
  @observable isLoading: string = false;

  contactsDs: DataSource = new DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
  });

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @computed
  get contactsDataSource() {
    return this.contactsDs.cloneWithRows(this.contacts.slice());
  }

  getAllProfiles(includePrivate = true): Array<Object> {
    let result = [];
    if (includePrivate && this.privateProfile) {
      result.push(this.privateProfile);
    }

    if (this.ownBusinesses.length > 0) {
      result = result.concat(this.ownBusinesses.slice());
    }

    if (this.staffBusinesses.length > 0) {
      result = result.concat(this.staffBusinesses.slice());
    }

    return result;
  }

  @action
  async load(): Promise<boolean> {
    const { api } = this.store;

    return apiHelper(api.profiles.getAccessibleList(), this)
      .cache('profiles', { lifetime: 3600 })
      .success((data: ProfilesData) => {
        this.ownBusinesses = data.businesses_own.map((profile) => {
          return new BusinessProfile(profile, this.store);
        });
        this.staffBusinesses = data.businesses_staff.map((profile) => {
          return new BusinessProfile(profile, this.store);
        });
        this.privateProfile = new PersonalProfile(data.private, this.store);

        this.contactsPaginationData = null;
        this.contacts = [];
      })
      .promise();
  }

  @action
  loadAllContacts() {
    const { api } = this.store;
    let pageCount = 0;
    let currentPage = 0;

    if (this.contactsPaginationData) {
      // pageCount - number, current - string
      pageCount = this.contactsPaginationData.pageCount;
      currentPage = +this.contactsPaginationData.current;
    }

    if (this.contactsDs.isLoading
      || (currentPage !== 0 && currentPage === pageCount)) {
      return;
    }

    apiHelper(
      api.profiles.getAllContacts(
        this.currentProfile.business.slug,
        currentPage + 1
      ),
      this.contactsDs
    ).success((data) => {
      this.contactsPaginationData = data.pagination_data;
      this.contacts = this.contacts.concat(data.contact_models);
    });
  }

  @action
  async loadApplications(profileId) {
    const { api } = this.store;

    const profile = this.businessById(profileId);
    if (profile.applications.length > 0) {
      return profile.applications;
    }

    return apiHelper(api.menu.getList(profileId))
      .cache(`applications-${profileId}`, { lifetime: 3600 })
      .success((data: Array<MenuItemData>) => {
        const apps = data
          .sort((a, b) => a.position - b.position)
          .map(item => new AppItem(item, this.store, profile));
        profile.applications = apps;
        return apps;
      })
      .promise();
  }

  @action
  async loadActivities(profileId) {
    const { api } = this.store;

    const profile = this.businessById(profileId);
    if (profile.activities.length > 0) {
      return profile.activities;
    }

    const slug = profile.business.slug;
    return apiHelper(api.business.getActivities(slug))
      .cache(`activities-${profileId}`, { lifetime: 3600 })
      .success((data: Array<ActivityItemData>) => {
        const activities = data
          .sort((a, b) => a.position - b.position)
          .map(item => new ActivityItem(item, this.store, profile));
        profile.activities = activities;
        return activities;
      })
      .promise();
  }

  @action
  async loadTodos(profileId) {
    const { api } = this.store;

    const profile = this.businessById(profileId);
    if (profile.todos.length > 0) {
      return profile.todos;
    }

    const slug = profile.business.slug;
    return apiHelper(api.business.getTodos(slug))
      .cache(`todos-${profileId}`, { lifetime: 3600 })
      .success((data: Array<ActivityItemData>) => {
        const activities = data
          .sort((a, b) => a.priority - b.priority)
          .filter(item => item.type !== 'todo_business_mobile_app')
          .map(item => new ActivityItem(item, this.store, profile));
        profile.todos = activities;
        return activities;
      })
      .promise();
  }

  @action
  setCurrentProfile(profile: Profile) {
    this.currentProfile = profile;
  }

  businessById(profileId): BusinessProfile {
    const profile = this.getAllProfiles().filter(p => p.id === profileId)[0];
    if (!profile || !profile.business) {
      throw new Error(`Couldn't find business with id = ${profileId}`);
    }

    return profile;
  }
}