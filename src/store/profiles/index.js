import { observable, action } from 'mobx';
import { apiHelper, log } from 'utils';

import type { ProfilesData } from '../../common/api/ProfilesApi';
import type { MenuItemData } from '../../common/api/MenuApi';
import type { ActivityItemData } from '../../common/api/BusinessApi';
import type Store from './index';
import ActivityItem from './models/ActivityItem';
import AppItem from './models/AppItem';
import BusinessProfile from './models/BusinessProfile';
import PersonalProfile from './models/PersonalProfile';
import Profile from './models/Profile';
import Offer from '../offers/models/Offer';

export default class ProfilesStore {
  @observable ownBusinesses: Array<BusinessProfile>   = [];
  @observable staffBusinesses: Array<BusinessProfile> = [];
  @observable privateProfile: PersonalProfile         = null;
  @observable profileOffers: Array<any> = [];
  @observable currentProfile: PersonalProfile | BusinessProfile = null;

  @observable logoUploadingProgress: number = 0;

  @observable error: string     = '';
  @observable isLoading: boolean = false;

  store: Store;

  constructor(store: Store) {
    this.store = store;
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
  async load(options = {}): Promise<boolean> {
    const { profiles } = this.store.api;

    return apiHelper(profiles.getAccessibleList.bind(profiles), this)
      .cache('profiles', { lifetime: 3600, noCache: !!options.noCache })
      .success((data: ProfilesData) => {
        this.ownBusinesses = data.businesses_own.map((profile) => {
          return new BusinessProfile(profile, this.store);
        });
        this.staffBusinesses = data.businesses_staff.map((profile) => {
          return new BusinessProfile(profile, this.store);
        });
        this.privateProfile = new PersonalProfile(data.private, this.store);
      })
      .promise();
  }

  @action
  async loadApplications(profileId) {
    if (profileId === null || profileId === undefined) return [];

    const { menu } = this.store.api;

    const profile = this.businessById(profileId);
    if (profile.applications.length > 0) {
      return profile.applications;
    }

    return apiHelper(menu.getList.bind(menu, profileId))
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
    if (profileId === null || profileId === undefined) return [];

    const { business } = this.store.api;

    const profile = this.businessById(profileId);
    if (profile.activities.length > 0) {
      return profile.activities;
    }

    const slug = profile.business.slug;
    return apiHelper(business.getActivities.bind(business, slug))
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
    if (profileId === null || profileId === undefined) return [];

    const { business } = this.store.api;

    const profile = this.businessById(profileId);
    if (profile.todos.length > 0) {
      return profile.todos;
    }

    const slug = profile.business.slug;
    return apiHelper(business.getTodos.bind(business, slug))
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
  getAllOffers(id: number) {
    const { profiles } = this.store.api;

    if (id === null || id === undefined) return null;

    return apiHelper(profiles.getAllOffers.bind(profiles, id), this)
      .success((data) => {
        this.profileOffers = data.map(o => new Offer(o));
        return this.profileOffers;
      })
      .promise();
  }

  @action
  setCurrentProfile(profile: Profile) {
    this.currentProfile = profile;
  }

  @action
  createNewBusiness(newBusiness) {
    const { business } = this.store.api;

    return apiHelper(
      business.createNewBusiness.bind(business, newBusiness),
      this
    ).success(data => data)
      .error(log.error)
      .promise();
  }

  @action
  getBusinessInfo(slug: string) {
    const { business } = this.store.api;

    return apiHelper(business.getBusinessInfo.bind(business, slug), this)
      .success(data => data)
      .error(log.error)
      .promise();
  }

  @action
  uploadBusinessLogo(mediaFileInfo) {
    this.logoUploadingProgress = 0;
    return this.store.api.business.uploadBusinessLogo(mediaFileInfo)
      .catch(log.error);
  }

  @action
  updateLogoUploadProgress(value: number) {
    this.logoUploadingProgress = 0;
    if (value >= 100) {
      this.logoUploadingProgress = 100;
    }
  }

  businessById(profileId): BusinessProfile {
    const profile = this.getAllProfiles().filter(p => p.id === profileId)[0];
    if (!profile || !profile.business) {
      throw new Error(`Couldn't find business with id = ${profileId}`);
    }

    return profile;
  }
}