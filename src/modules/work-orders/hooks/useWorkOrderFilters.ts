import { useState } from 'react';
import { OperationalStatus } from '../types/work-order.types';

export function useWorkOrderFilters() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedAdvisor, setAppliedAdvisor] = useState('all');
  const [appliedStatus, setAppliedStatus] = useState<OperationalStatus | 'all'>('all');
  const [appliedOnlyDelayed, setAppliedOnlyDelayed] = useState(false);
  const [appliedIncludeClosed, setAppliedIncludeClosed] = useState(false);

  const [draftAdvisor, setDraftAdvisor] = useState('all');
  const [draftStatus, setDraftStatus] = useState<OperationalStatus | 'all'>('all');
  const [draftOnlyDelayed, setDraftOnlyDelayed] = useState(false);
  const [draftIncludeClosed, setDraftIncludeClosed] = useState(false);

  const openFilters = () => {
    setDraftAdvisor(appliedAdvisor);
    setDraftStatus(appliedStatus);
    setDraftOnlyDelayed(appliedOnlyDelayed);
    setDraftIncludeClosed(appliedIncludeClosed);
    setIsFilterOpen(true);
  };

  const closeFilters = () => {
    setIsFilterOpen(false);
  };

  const applyFilters = () => {
    setAppliedAdvisor(draftAdvisor);
    setAppliedStatus(draftStatus);
    setAppliedOnlyDelayed(draftOnlyDelayed);
    setAppliedIncludeClosed(draftIncludeClosed);
    setIsFilterOpen(false);
  };

  const resetFilters = (onResetSearch?: () => void) => {
    setDraftAdvisor('all');
    setDraftStatus('all');
    setDraftOnlyDelayed(false);
    setDraftIncludeClosed(false);
    setAppliedAdvisor('all');
    setAppliedStatus('all');
    setAppliedOnlyDelayed(false);
    setAppliedIncludeClosed(false);
    if (onResetSearch) {
      onResetSearch();
    }
    setIsFilterOpen(false);
  };

  return {
    isFilterOpen,
    appliedFilters: {
      advisor: appliedAdvisor,
      operationalStatus: appliedStatus,
      onlyDelayed: appliedOnlyDelayed,
      includeClosed: appliedIncludeClosed,
    },
    draft: {
      advisor: draftAdvisor,
      status: draftStatus,
      onlyDelayed: draftOnlyDelayed,
      includeClosed: draftIncludeClosed,
      setAdvisor: setDraftAdvisor,
      setStatus: setDraftStatus,
      setOnlyDelayed: setDraftOnlyDelayed,
      setIncludeClosed: setDraftIncludeClosed,
    },
    openFilters,
    closeFilters,
    applyFilters,
    resetFilters,
  };
}

