import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { offlineStorage, STORES } from './OfflineStorage';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  Upload, 
  Check, 
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SyncManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState({ success: 0, failed: 0 });
  const [showDetails, setShowDetails] = useState(false);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending count
  useEffect(() => {
    loadPendingCount();
    const interval = setInterval(loadPendingCount, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingCount > 0 && !syncing) {
      const timer = setTimeout(() => {
        syncData();
      }, 2000); // Wait 2s after coming online
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingCount]);

  const loadPendingCount = async () => {
    try {
      const count = await offlineStorage.getAllPendingCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Error loading pending count:', error);
    }
  };

  const syncData = async () => {
    if (!isOnline || syncing) return;

    setSyncing(true);
    setSyncStatus({ success: 0, failed: 0 });

    try {
      // Sync shops
      const pendingShops = await offlineStorage.getPendingShops();
      for (const shop of pendingShops) {
        try {
          const { id, timestamp, synced, ...shopData } = shop;
          await base44.entities.Shop.create(shopData);
          await offlineStorage.deleteSynced(STORES.SHOPS, id);
          setSyncStatus(prev => ({ ...prev, success: prev.success + 1 }));
        } catch (error) {
          console.error('Error syncing shop:', error);
          setSyncStatus(prev => ({ ...prev, failed: prev.failed + 1 }));
        }
      }

      // Sync inspections
      const pendingInspections = await offlineStorage.getPendingInspections();
      for (const inspection of pendingInspections) {
        try {
          const { id, timestamp, synced, ...inspectionData } = inspection;
          await base44.entities.Inspection.create(inspectionData);
          await offlineStorage.deleteSynced(STORES.INSPECTIONS, id);
          setSyncStatus(prev => ({ ...prev, success: prev.success + 1 }));
        } catch (error) {
          console.error('Error syncing inspection:', error);
          setSyncStatus(prev => ({ ...prev, failed: prev.failed + 1 }));
        }
      }

      setLastSync(new Date());
      await loadPendingCount();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (!showDetails && pendingCount === 0 && isOnline) {
    return null; // Hide when nothing to show
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 lg:top-4 right-4 z-40 max-w-sm"
    >
      <Card className="bg-slate-900 border-slate-700 shadow-2xl overflow-hidden">
        <div className="p-4">
          {/* Status Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-emerald-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-white font-semibold">
                {isOnline ? 'Online' : 'Offline Mode'}
              </span>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400">
                {pendingCount} pending
              </Badge>
            )}
          </div>

          {/* Sync Status */}
          {pendingCount > 0 && (
            <div className="space-y-3">
              <p className="text-slate-400 text-sm">
                {isOnline 
                  ? 'Data ready to sync with server' 
                  : 'Data saved locally, will sync when online'}
              </p>

              {isOnline && (
                <Button
                  onClick={syncData}
                  disabled={syncing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  {syncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Sync Now
                    </>
                  )}
                </Button>
              )}

              {/* Sync Results */}
              {(syncStatus.success > 0 || syncStatus.failed > 0) && (
                <div className="space-y-2 text-sm">
                  {syncStatus.success > 0 && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span>{syncStatus.success} synced successfully</span>
                    </div>
                  )}
                  {syncStatus.failed > 0 && (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>{syncStatus.failed} failed</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Last Sync Time */}
          {lastSync && (
            <p className="text-slate-500 text-xs mt-3">
              Last sync: {lastSync.toLocaleTimeString()}
            </p>
          )}

          {/* Success State */}
          {pendingCount === 0 && isOnline && (
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">All data synced</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}