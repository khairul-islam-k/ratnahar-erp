import React from 'react'
import { NavItem } from './tenant-sidebar'
import { useAuthStore } from '@/app/stores/auth.store';

export const usePermissionSidebar = (navigation: NavItem[]) => {
    const permission = useAuthStore(s => s.permission);
    const navFilter = navigation.filter(singleItems => permission?.some(
    (permission) => permission.featureKey === singleItems.title
  ))

  return navFilter;
}
