import React from 'react'
import type { PermissionAction, RbacFeature } from '../../../../../types/role'
import { useAuthStore } from '@/app/stores/auth.store';

const UseCheckPermission = (featureKey: RbacFeature, action: PermissionAction) => {
    const permission = useAuthStore(s => s.permission);
    const checkPermission = permission?.some(data =>
        (data.featureKey === featureKey) &&
        (data.actionKey === action)
    );
    return Boolean(checkPermission);
}

export default UseCheckPermission