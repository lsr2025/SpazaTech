/**
 * Copyright © 2026 Kwahlelwa Group (Pty) Ltd.
 * All Rights Reserved.
 *
 * This source code is confidential and proprietary.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * Patent Pending - ZA Provisional Application
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Save,
  Navigation,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function AttendanceTracking() {
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [gpsLoading, setGpsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    agent_email: '',
    agent_name: '',
    date: new Date().toISOString().split('T')[0],
    check_in_time: '',
    check_in_location: '',
    check_in_latitude: null,
    check_in_longitude: null,
    check_out_time: '',
    check_out_location: '',
    check_out_latitude: null,
    check_out_longitude: null,
    municipality: '',
    ward: '',
    activity_type: '',
    shops_profiled: 0,
    inspections_completed: 0,
    notes: '',
    supervisor_notes: '',
    status: 'checked_in'
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['field-agents'],
    queryFn: () => base44.entities.FieldAgent.list('-created_date', 100)
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendance', selectedDate],
    queryFn: () => base44.entities.Attendance.filter({ date: selectedDate })
  });

  const createAttendance = useMutation({
    mutationFn: (data) => base44.entities.Attendance.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      resetForm();
    }
  });

  const captureGPS = (type) => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            [`${type}_latitude`]: position.coords.latitude,
            [`${type}_longitude`]: position.coords.longitude
          }));
          setGpsLoading(false);
        },
        (error) => {
          console.error('GPS error:', error);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const handleAgentSelect = (agentEmail) => {
    const agent = agents.find(a => a.user_email === agentEmail);
    setSelectedAgent(agentEmail);
    setFormData(prev => ({
      ...prev,
      agent_email: agentEmail,
      agent_name: agent?.full_name || ''
    }));
  };

  const calculateHours = () => {
    if (formData.check_in_time && formData.check_out_time) {
      const checkIn = new Date(`${formData.date}T${formData.check_in_time}`);
      const checkOut = new Date(`${formData.date}T${formData.check_out_time}`);
      const hours = (checkOut - checkIn) / (1000 * 60 * 60);
      return hours > 0 ? hours : 0;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hours = calculateHours();
    createAttendance.mutate({
      ...formData,
      hours_worked: hours,
      check_in_time: formData.check_in_time ? `${formData.date}T${formData.check_in_time}:00Z` : null,
      check_out_time: formData.check_out_time ? `${formData.date}T${formData.check_out_time}:00Z` : null
    });
  };

  const resetForm = () => {
    setFormData({
      agent_email: '',
      agent_name: '',
      date: new Date().toISOString().split('T')[0],
      check_in_time: '',
      check_in_location: '',
      check_in_latitude: null,
      check_in_longitude: null,
      check_out_time: '',
      check_out_location: '',
      check_out_latitude: null,
      check_out_longitude: null,
      municipality: '',
      ward: '',
      activity_type: '',
      shops_profiled: 0,
      inspections_completed: 0,
      notes: '',
      supervisor_notes: '',
      status: 'checked_in'
    });
    setSelectedAgent('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Link to={createPageUrl('HRDashboard')}>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Attendance Tracking</h1>
              <p className="text-slate-400 text-sm">Record field agent attendance and activities</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Record Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Field Agent *</Label>
                      <Select value={selectedAgent} onValueChange={handleAgentSelect}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {agents.map(agent => (
                            <SelectItem key={agent.id} value={agent.user_email}>
                              {agent.full_name} ({agent.employee_id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Date *</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Municipality</Label>
                      <Select value={formData.municipality} onValueChange={(v) => setFormData(prev => ({ ...prev, municipality: v }))}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="KwaDukuza">KwaDukuza</SelectItem>
                          <SelectItem value="Mandeni">Mandeni</SelectItem>
                          <SelectItem value="Ndwedwe">Ndwedwe</SelectItem>
                          <SelectItem value="Maphumulo">Maphumulo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Ward</Label>
                      <Input
                        value={formData.ward}
                        onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Activity Type *</Label>
                    <Select value={formData.activity_type} onValueChange={(v) => setFormData(prev => ({ ...prev, activity_type: v }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select activity" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="shop_profiling">Shop Profiling</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="follow_up">Follow-up</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Check-in */}
                  <div className="p-4 bg-slate-800/50 rounded-lg space-y-3">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Check-In
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-white">Time</Label>
                        <Input
                          type="time"
                          value={formData.check_in_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, check_in_time: e.target.value }))}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Location</Label>
                        <Input
                          value={formData.check_in_location}
                          onChange={(e) => setFormData(prev => ({ ...prev, check_in_location: e.target.value }))}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => captureGPS('check_in')}
                      disabled={gpsLoading}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 gap-2"
                    >
                      {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                      Capture Check-In GPS
                    </Button>
                    {formData.check_in_latitude && (
                      <p className="text-xs text-slate-400">
                        GPS: {formData.check_in_latitude.toFixed(6)}, {formData.check_in_longitude.toFixed(6)}
                      </p>
                    )}
                  </div>

                  {/* Check-out */}
                  <div className="p-4 bg-slate-800/50 rounded-lg space-y-3">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      Check-Out
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-white">Time</Label>
                        <Input
                          type="time"
                          value={formData.check_out_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, check_out_time: e.target.value }))}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Location</Label>
                        <Input
                          value={formData.check_out_location}
                          onChange={(e) => setFormData(prev => ({ ...prev, check_out_location: e.target.value }))}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => captureGPS('check_out')}
                      disabled={gpsLoading}
                      className="w-full bg-amber-600 hover:bg-amber-700 gap-2"
                    >
                      {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                      Capture Check-Out GPS
                    </Button>
                    {formData.check_out_latitude && (
                      <p className="text-xs text-slate-400">
                        GPS: {formData.check_out_latitude.toFixed(6)}, {formData.check_out_longitude.toFixed(6)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Shops Profiled</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.shops_profiled}
                        onChange={(e) => setFormData(prev => ({ ...prev, shops_profiled: parseInt(e.target.value) || 0 }))}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Inspections Completed</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.inspections_completed}
                        onChange={(e) => setFormData(prev => ({ ...prev, inspections_completed: parseInt(e.target.value) || 0 }))}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Agent Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Daily activity summary..."
                      className="bg-slate-800 border-slate-700 text-white min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Supervisor Notes</Label>
                    <Textarea
                      value={formData.supervisor_notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, supervisor_notes: e.target.value }))}
                      placeholder="Supervisor observations..."
                      className="bg-slate-800 border-slate-700 text-white min-h-20"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm} className="border-slate-600 text-white">
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.agent_email || !formData.activity_type || createAttendance.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                    >
                      {createAttendance.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Attendance
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Today's Attendance */}
          <div>
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Today's Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendance.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">No records yet</p>
                  ) : (
                    attendance.map(record => (
                      <div key={record.id} className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium text-sm">{record.agent_name}</p>
                          <Badge className={
                            record.status === 'checked_out' ? 'bg-blue-500/20 text-blue-400' :
                            record.status === 'checked_in' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-slate-500/20 text-slate-400'
                          }>
                            {record.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-slate-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {record.check_in_time && format(new Date(record.check_in_time), 'HH:mm')}
                            {record.check_out_time && ` - ${format(new Date(record.check_out_time), 'HH:mm')}`}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {record.municipality || 'N/A'}
                          </div>
                          {record.shops_profiled > 0 && (
                            <p className="text-cyan-400">{record.shops_profiled} shops profiled</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}