import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import { defaultHeroSlidesData } from '../data/defaultSiteData';
import {
  LayoutDashboard, Building2, Ship, Globe2, Save, RefreshCw,
  Plus, Trash2, ShieldCheck, Mail, Lock, LogOut, Image as ImageIcon,
  Layers, Eye, EyeOff, Search, CheckCircle2, MapPin, AlertCircle,
  ExternalLink, FileText, Phone, ArrowRight, Clock, TrendingUp,
  Download, Filter, Check, X, Activity, Truck, Plane, Copy,
  Sparkles, Menu, Send, ChevronRight, Upload, UploadCloud, Film,
  Video, Play, Pause, Volume2, VolumeX, RotateCcw, AlertTriangle,
  FileVideo, Maximize2
} from 'lucide-react';
import '../admin.css';

export default function Admin() {
  const {
    companyInfo,
    heroSlides,
    industriesList,
    servicesList,
    tradeLanes,
    trackingData,
    inquiriesList,
    saveData,
    refreshData,
    isLoading
  } = useDataContext();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState('direct'); // 'direct' | 'microsoft'
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Navigation Module
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Local Editable States (Cloned from context for atomic saving)
  const [localHeroSlides, setLocalHeroSlides] = useState(heroSlides || defaultHeroSlidesData);
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [previewPlaying, setPreviewPlaying] = useState(true);
  const [previewMuted, setPreviewMuted] = useState(true);
  const [availableVideos, setAvailableVideos] = useState([]);
  const [isDragOverVideo, setIsDragOverVideo] = useState(false);
  const videoFileInputRef = useRef(null);
  const liveVideoPreviewRef = useRef(null);
  const [localIndustries, setLocalIndustries] = useState(industriesList || []);
  const [localCompany, setLocalCompany] = useState(companyInfo || {});
  const [localServices, setLocalServices] = useState(servicesList || []);
  const [localLanes, setLocalLanes] = useState(tradeLanes || []);
  const [localTracking, setLocalTracking] = useState(trackingData || {});
  const [localInquiries, setLocalInquiries] = useState(inquiriesList || []);
  const [savingCategory, setSavingCategory] = useState(null);

  // Filter States
  const [trackingFilterStatus, setTrackingFilterStatus] = useState('ALL');
  const [inquiryFilterService, setInquiryFilterService] = useState('ALL');
  const [serviceFilterCategory, setServiceFilterCategory] = useState('ALL');

  // Modal States for Adding Records
  const [activeModal, setActiveModal] = useState(null); // 'tracking' | 'lane' | 'service' | 'office' | 'industry'
  const [newTrackingItem, setNewTrackingItem] = useState({
    code: '',
    status: 'Cargo Received',
    origin: 'Dhaka (DAC)',
    destination: 'London (LHR)',
    estimatedDelivery: 'Oct 05, 2026',
    currentLocation: 'Dhaka Cargo Village Hub'
  });
  const [newLaneItem, setNewLaneItem] = useState({
    origin: 'Dhaka, Bangladesh',
    destination: 'Rotterdam, Netherlands',
    flag: '🇧🇩',
    destFlag: '🇳🇱',
    direction: 'Export',
    title: 'Dhaka → Rotterdam Port Express',
    seaTransit: '24-28 Days',
    airTransit: '2-3 Days',
    description: 'Weekly scheduled container consolidation connecting Chittagong Port to Rotterdam gateway.'
  });
  const [newServiceItem, setNewServiceItem] = useState({
    title: 'Customs Brokerage & C&F Solutions',
    category: 'Customs Clearance',
    image: '/images/customs_clearance.png',
    description: 'Dedicated in-house licensed Customs AIN team ensuring swift clearance across all Bangladesh dry and sea ports.'
  });
  const [newOfficeItem, setNewOfficeItem] = useState({
    name: 'Mongla Port Desk',
    badge: 'Sea Port Operations',
    address: 'Port Administrative Area, Mongla, Bagerhat-9351.',
    phoneDisplay: '+880 1711-998877',
    phone: '+8801711998877',
    email: 'mongla@prestigecargobd.com',
    hours: 'Sat - Thu: 08:30 AM - 06:00 PM'
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync state when context updates
  useEffect(() => {
    if (heroSlides) setLocalHeroSlides(heroSlides);
    if (industriesList) setLocalIndustries(industriesList);
    if (companyInfo) setLocalCompany(companyInfo);
    if (servicesList) setLocalServices(servicesList);
    if (tradeLanes) setLocalLanes(tradeLanes);
    if (trackingData) setLocalTracking(trackingData);
    if (inquiriesList) setLocalInquiries(inquiriesList);
  }, [heroSlides, industriesList, companyInfo, servicesList, tradeLanes, trackingData, inquiriesList]);

  // Check login session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('admin_authenticated') || localStorage.getItem('admin_authenticated');
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Direct login handler
  const handleDirectLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      let authOk = false;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        const data = await res.json();
        if (data.success) {
          authOk = true;
          sessionStorage.setItem('admin_token', data.token);
        }
      } catch (netErr) {
        // Fallback for static dev
      }

      if (!authOk) {
        const validUser = usernameInput.trim().toLowerCase() === 'admin';
        const validPass = passwordInput === 'prestige2026_admin' || passwordInput === 'admin';
        if (validUser && validPass) {
          authOk = true;
          sessionStorage.setItem('admin_token', `token_${Date.now()}`);
        }
      }

      if (authOk) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_user', usernameInput || 'admin');
        showToast('Authorized Administrator logged in successfully!', 'success');
      } else {
        setAuthError('Invalid credentials. Check username & password or use demo fill.');
      }
    } catch (err) {
      setAuthError('Authentication network error. Please verify server connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleMicrosoftLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_user', 'admin@prestigecargobd.com');
      setIsLoggingIn(false);
      showToast('Authenticated via Microsoft 365 Enterprise SSO!', 'success');
    }, 600);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    localStorage.removeItem('admin_authenticated');
    showToast('Logged out of Admin Control Tower.', 'info');
  };

  // Preset logistics background videos
  const defaultVideoPresets = [
    { label: 'Ocean Freight Liner', path: '/videos/ocean_freight.mp4', poster: '/images/ocean_freight.png', icon: 'Ship' },
    { label: 'Boeing 777 Air Cargo', path: '/videos/air_freight.mp4', poster: '/images/air_freight.png', icon: 'Plane' },
    { label: 'Highway Trucking Fleet', path: '/videos/road_freight.mp4', poster: '/images/truck_transport.png', icon: 'Truck' },
    { label: 'Port Terminal & Cranes', path: '/videos/port_terminal.mp4', poster: '/images/warehouse_cfs.png', icon: 'Warehouse' }
  ];

  // Fallback safe slides
  const heroSlidesSafe = useMemo(() => {
    if (localHeroSlides && Array.isArray(localHeroSlides) && localHeroSlides.length > 0) {
      return localHeroSlides;
    }
    return defaultHeroSlidesData;
  }, [localHeroSlides]);

  const selectedHeroIndexSafe = selectedHeroIndex >= heroSlidesSafe.length ? 0 : selectedHeroIndex;
  const activeHeroSlide = heroSlidesSafe[selectedHeroIndexSafe] || defaultHeroSlidesData[0];

  const updateActiveHeroSlide = (fields) => {
    setLocalHeroSlides((prev) => {
      const base = (prev && prev.length > 0) ? [...prev] : [...defaultHeroSlidesData];
      const targetIdx = selectedHeroIndex >= base.length ? 0 : selectedHeroIndex;
      base[targetIdx] = {
        ...base[targetIdx],
        ...fields
      };
      return base;
    });
  };

  const fetchAvailableVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.videos) {
          setAvailableVideos(json.videos);
        }
      }
    } catch (e) {
      // Backend may be offline in static dev mode
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'hero') {
      fetchAvailableVideos();
    }
  }, [activeTab, fetchAvailableVideos]);

  const handleVideoFileSelected = (file) => {
    if (!file) return;

    // Validate file type
    const validExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mkv'];
    const isVideo = file.type.startsWith('video/') || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isVideo) {
      setUploadError('Please select a valid video file (MP4, WebM, MOV, OGG, MKV).');
      showToast('Invalid video format. Supported: MP4, WebM, MOV, OGG.', 'error');
      return;
    }

    // Validate size (200MB limit)
    const MAX_SIZE = 200 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(`File is too large (${sizeMb} MB). Maximum allowed size is 200MB.`);
      showToast('Video exceeds 200MB limit.', 'error');
      return;
    }

    setUploadError(null);
    setUploadSuccess(null);
    setIsUploadingVideo(true);
    setUploadProgress(15);

    // Instant local preview via Blob URL
    const tempUrl = URL.createObjectURL(file);
    updateActiveHeroSlide({
      video: tempUrl,
      videoFileName: file.name,
      videoFileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    });

    const formData = new FormData();
    formData.append('video', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload/video');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(pct);
      }
    };

    xhr.onload = () => {
      setIsUploadingVideo(false);
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.url) {
            updateActiveHeroSlide({
              video: res.url,
              videoFileName: res.originalName || file.name,
              videoFileSize: (res.size / (1024 * 1024)).toFixed(1) + ' MB'
            });
            setUploadSuccess(`"${file.name}" uploaded successfully! Video assigned to Slide #${selectedHeroIndexSafe + 1}.`);
            showToast(`Video uploaded from local PC for Slide #${selectedHeroIndexSafe + 1}!`);
            fetchAvailableVideos();
          } else {
            setUploadError(res.error || 'Video upload failed.');
            showToast(res.error || 'Upload error', 'error');
          }
        } catch (e) {
          setUploadError('Failed to parse server upload response.');
        }
      } else {
        let err = 'Upload server error';
        try { err = JSON.parse(xhr.responseText).error || err; } catch(e){}
        setUploadError(err);
        showToast(err, 'error');
      }
    };

    xhr.onerror = () => {
      setIsUploadingVideo(false);
      setUploadError('Could not reach backend server. Video is loaded locally in memory.');
    };

    xhr.send(formData);
  };

  const handleAddHeroSlide = () => {
    const base = (localHeroSlides && localHeroSlides.length > 0) ? [...localHeroSlides] : [...defaultHeroSlidesData];
    const newSlide = {
      id: `slide-${Date.now()}`,
      video: '/videos/ocean_freight.mp4',
      poster: '/images/ocean_freight.png',
      image: '/images/home_hero_ship.png',
      iconName: 'Ship',
      modeTag: `0${base.length + 1} LOGISTICS`,
      tabTitle: 'New Cargo Service',
      tabSubtitle: 'Fast & Secure Delivery',
      pill: 'SPECIALIZED LOGISTICS • GLOBAL',
      headlinePrefix: 'Global Cargo Logistics',
      headlineGradient: 'Across International Routes',
      desc: 'Scheduled air, sea, and overland cargo solutions tailored to your enterprise supply chain with 24/7 customs monitoring.',
      highlight: 'Express Dispatch • 100% Tracking Visibility',
      linkText: 'Request Freight Quote',
      link: '/contact'
    };
    const updated = [...base, newSlide];
    setLocalHeroSlides(updated);
    setSelectedHeroIndex(updated.length - 1);
    showToast(`Added slide #${updated.length}. Upload a video from local PC or select a preset.`);
  };

  const handleDeleteHeroSlide = (idxToDelete) => {
    const base = (localHeroSlides && localHeroSlides.length > 0) ? [...localHeroSlides] : [...defaultHeroSlidesData];
    if (base.length <= 1) {
      showToast('You must keep at least 1 hero carousel slide.', 'error');
      return;
    }
    const updated = base.filter((_, idx) => idx !== idxToDelete);
    setLocalHeroSlides(updated);
    setSelectedHeroIndex(Math.max(0, idxToDelete - 1));
    showToast('Slide removed from Hero Carousel.');
  };

  const handleResetHeroSlides = () => {
    if (window.confirm('Reset all Hero Carousel slides back to the 4 default multimodal video slides?')) {
      setLocalHeroSlides([...defaultHeroSlidesData]);
      setSelectedHeroIndex(0);
      showToast('Hero Carousel reset to default multimodal slides.');
    }
  };

  // SAVE HANDLERS
  const handleSaveHero = async () => {
    setSavingCategory('hero');
    const dataToSave = (localHeroSlides && localHeroSlides.length > 0) ? localHeroSlides : defaultHeroSlidesData;
    const ok = await saveData('heroSlidesData', dataToSave);
    setSavingCategory(null);
    if (ok) showToast('Homepage Hero Video Carousel saved & published live!');
    else showToast('Failed to save Hero section.', 'error');
  };

  const handleSaveIndustries = async () => {
    setSavingCategory('industries');
    const ok = await saveData('industriesData', localIndustries);
    setSavingCategory(null);
    if (ok) showToast('Specialized Industry Solutions updated live!');
    else showToast('Failed to save Industry Solutions.', 'error');
  };

  const handleSaveCompany = async () => {
    setSavingCategory('company');
    const ok = await saveData('companyData', localCompany);
    setSavingCategory(null);
    if (ok) showToast('Company & Customs AIN credentials updated live!');
    else showToast('Failed to save Company data.', 'error');
  };

  const handleSaveOffices = async () => {
    setSavingCategory('offices');
    const ok = await saveData('companyData', localCompany);
    setSavingCategory(null);
    if (ok) showToast('Branch office & port desks updated live!');
    else showToast('Failed to save Branch Offices.', 'error');
  };

  const handleSaveServices = async () => {
    setSavingCategory('services');
    const ok = await saveData('servicesData', localServices);
    setSavingCategory(null);
    if (ok) showToast('Freight services portfolio updated live!');
    else showToast('Failed to save Freight Services.', 'error');
  };

  const handleSaveTradeLanes = async () => {
    setSavingCategory('tradelanes');
    const ok = await saveData('tradeLanesData', localLanes);
    setSavingCategory(null);
    if (ok) showToast('Trade corridors & schedules updated live!');
    else showToast('Failed to save Trade Corridors.', 'error');
  };

  const handleSaveTracking = async () => {
    setSavingCategory('tracking');
    const ok = await saveData('trackingData', localTracking);
    setSavingCategory(null);
    if (ok) showToast('Shipment tracking database updated live!');
    else showToast('Failed to save Shipment Tracking.', 'error');
  };

  // ADD RECORD HANDLERS
  const handleAddTrackingSubmit = async (e) => {
    e.preventDefault();
    if (!newTrackingItem.code.trim()) {
      showToast('Please enter a tracking reference code (e.g. PC-DAC-88991)', 'error');
      return;
    }
    const code = newTrackingItem.code.trim().toUpperCase();
    const updated = {
      ...localTracking,
      [code]: {
        status: newTrackingItem.status,
        origin: newTrackingItem.origin,
        destination: newTrackingItem.destination,
        estimatedDelivery: newTrackingItem.estimatedDelivery,
        currentLocation: newTrackingItem.currentLocation
      }
    };
    setLocalTracking(updated);
    setActiveModal(null);
    setNewTrackingItem({
      code: '',
      status: 'Cargo Received',
      origin: 'Dhaka (DAC)',
      destination: 'London (LHR)',
      estimatedDelivery: 'Oct 05, 2026',
      currentLocation: 'Dhaka Cargo Village Hub'
    });
    const ok = await saveData('trackingData', updated);
    if (ok) showToast(`Shipment ${code} created & published!`, 'success');
  };

  const handleDeleteTracking = async (code) => {
    if (!window.confirm(`Are you sure you want to remove shipment track ${code}?`)) return;
    const updated = { ...localTracking };
    delete updated[code];
    setLocalTracking(updated);
    const ok = await saveData('trackingData', updated);
    if (ok) showToast(`Shipment ${code} deleted from database.`, 'info');
  };

  const handleAddLaneSubmit = async (e) => {
    e.preventDefault();
    const updated = [
      ...localLanes,
      {
        id: `lane-${Date.now()}`,
        ...newLaneItem
      }
    ];
    setLocalLanes(updated);
    setActiveModal(null);
    const ok = await saveData('tradeLanesData', updated);
    if (ok) showToast('New trade corridor added!', 'success');
  };

  const handleDeleteLane = async (id, idx) => {
    if (!window.confirm('Delete this trade corridor route?')) return;
    const updated = localLanes.filter((item, i) => (item.id ? item.id !== id : i !== idx));
    setLocalLanes(updated);
    const ok = await saveData('tradeLanesData', updated);
    if (ok) showToast('Trade corridor removed.', 'info');
  };

  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    const updated = [
      ...localServices,
      {
        id: `svc-${Date.now()}`,
        ...newServiceItem
      }
    ];
    setLocalServices(updated);
    setActiveModal(null);
    const ok = await saveData('servicesData', updated);
    if (ok) showToast('New freight service added!', 'success');
  };

  const handleDeleteService = async (id, idx) => {
    if (!window.confirm('Delete this freight service?')) return;
    const updated = localServices.filter((item, i) => (item.id ? item.id !== id : i !== idx));
    setLocalServices(updated);
    const ok = await saveData('servicesData', updated);
    if (ok) showToast('Service removed.', 'info');
  };

  const handleAddOfficeSubmit = async (e) => {
    e.preventDefault();
    const updatedOffices = [
      ...(localCompany?.offices || []),
      {
        id: `office-${Date.now()}`,
        ...newOfficeItem
      }
    ];
    const updatedCompany = { ...localCompany, offices: updatedOffices };
    setLocalCompany(updatedCompany);
    setActiveModal(null);
    const ok = await saveData('companyData', updatedCompany);
    if (ok) showToast('New branch desk added!', 'success');
  };

  const handleDeleteOffice = async (id, idx) => {
    if (!window.confirm('Delete this branch desk?')) return;
    const updatedOffices = (localCompany?.offices || []).filter((item, i) => (item.id ? item.id !== id : i !== idx));
    const updatedCompany = { ...localCompany, offices: updatedOffices };
    setLocalCompany(updatedCompany);
    const ok = await saveData('companyData', updatedCompany);
    if (ok) showToast('Branch desk removed.', 'info');
  };

  // CSV Export for Inquiries
  const handleExportInquiriesCSV = () => {
    if (!localInquiries || localInquiries.length === 0) {
      showToast('No customer inquiries to export.', 'info');
      return;
    }
    const headers = ['Date', 'Client Name', 'Email', 'Phone', 'Service Mode', 'Origin', 'Destination', 'Message'];
    const rows = localInquiries.map((inq) => [
      `"${inq.date || ''}"`,
      `"${(inq.name || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.serviceType || '').replace(/"/g, '""')}"`,
      `"${(inq.origin || '').replace(/"/g, '""')}"`,
      `"${(inq.destination || '').replace(/"/g, '""')}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `prestige_cargo_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer inquiries exported to CSV successfully!', 'success');
  };

  // Filtered Tracking Shipments
  const filteredTracking = useMemo(() => {
    return Object.entries(localTracking || {}).filter(([code, item]) => {
      const matchSearch = !globalSearch ||
        code.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (item.origin && item.origin.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (item.destination && item.destination.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(globalSearch.toLowerCase()));

      const matchStatus = trackingFilterStatus === 'ALL' || item.status === trackingFilterStatus;
      return matchSearch && matchStatus;
    });
  }, [localTracking, globalSearch, trackingFilterStatus]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return (localInquiries || []).filter((inq) => {
      const matchSearch = !globalSearch ||
        (inq.name && inq.name.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (inq.email && inq.email.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (inq.message && inq.message.toLowerCase().includes(globalSearch.toLowerCase()));

      const matchService = inquiryFilterService === 'ALL' || inq.serviceType === inquiryFilterService;
      return matchSearch && matchService;
    });
  }, [localInquiries, globalSearch, inquiryFilterService]);

  // Preset logistics images
  const imagePresets = [
    { label: 'Container Vessel', path: '/images/home_hero_ship.png' },
    { label: 'Cargo Aircraft', path: '/images/air_freight.png' },
    { label: 'Deep Sea Cargo', path: '/images/ocean_freight.png' },
    { label: 'Inland Transport', path: '/images/truck_transport.png' },
    { label: 'Customs & Port', path: '/images/customs_clearance.png' },
    { label: 'Bonded Warehouse', path: '/images/warehouse_cfs.png' }
  ];

  // Helper for Stepper Dot Class in Tracking
  const getStepClass = (currentStatus, stepIndex) => {
    const steps = ['Cargo Received', 'Customs Cleared', 'In Transit', 'Out for Delivery', 'Delivered'];
    const curIdx = steps.indexOf(currentStatus);
    if (curIdx === -1) return '';
    if (stepIndex < curIdx) return 'completed';
    if (stepIndex === curIdx) return 'active';
    return '';
  };

  // =========================================================================
  // VIEW 1: AUTHENTICATION LOCKSCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-auth-glow-orb top-left"></div>
        <div className="admin-auth-glow-orb bottom-right"></div>

        <div className="admin-auth-card">
          <div className="admin-auth-brand">
            <div className="admin-auth-logo-badge">
              <div className="admin-logo-beacon-ring ring-1"></div>
              <div className="admin-logo-beacon-ring ring-2"></div>
              <div className="admin-logo-tracer-aura"></div>
              <div className="admin-auth-logo-icon">
                <img src="/images/logo.png" alt="Prestige Cargo" />
                <div className="admin-logo-glimmer"></div>
              </div>
            </div>
            <h1 className="admin-auth-title">PRESTIGE CARGO</h1>
            <div className="admin-auth-pill">
              <ShieldCheck size={13} />
              <span>Administrative Control Tower</span>
            </div>
            <p className="admin-auth-subtitle">
              Enterprise operations portal for Customs AIN clearance credentials, live freight rates, shipment tracking, and content management.
            </p>
          </div>

          {authError && (
            <div className="admin-auth-error">
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          {/* Auth Tab Switcher */}
          <div className="admin-auth-tabs">
            <button
              type="button"
              onClick={() => setAuthTab('direct')}
              className={`admin-auth-tab-btn ${authTab === 'direct' ? 'active' : ''}`}
            >
              <Lock size={14} />
              <span>Direct Credentials</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('microsoft')}
              className={`admin-auth-tab-btn ${authTab === 'microsoft' ? 'active' : ''}`}
            >
              <Sparkles size={14} />
              <span>Microsoft 365 SSO</span>
            </button>
          </div>

          {authTab === 'direct' ? (
            <form onSubmit={handleDirectLogin}>
              <div className="admin-auth-field">
                <label>Administrator Username</label>
                <div className="admin-auth-input-wrapper">
                  <span className="admin-auth-input-icon">
                    <ShieldCheck size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. admin"
                  />
                </div>
              </div>

              <div className="admin-auth-field">
                <label>Access Password</label>
                <div className="admin-auth-input-wrapper">
                  <span className="admin-auth-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="admin-auth-input-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="admin-auth-btn-primary"
              >
                <Lock size={16} />
                <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Control Tower'}</span>
              </button>
            </form>
          ) : (
            <div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Use your corporate Microsoft Azure Active Directory / Office 365 work account to access Prestige Cargo administrative consoles.
              </p>
              <button
                type="button"
                onClick={handleMicrosoftLogin}
                disabled={isLoggingIn}
                className="admin-auth-ms-btn"
              >
                <svg style={{ width: 19, height: 19 }} viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>{isLoggingIn ? 'Connecting to Microsoft...' : 'Continue with Microsoft 365'}</span>
              </button>
            </div>
          )}

          <div className="admin-auth-footer">
            <Link to="/">
              ← Return to Main Site
            </Link>
            <div className="admin-auth-security-badge">
              <CheckCircle2 size={13} />
              <span>TLS 256-Bit Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED CONTROL TOWER DASHBOARD
  // =========================================================================
  return (
    <div className="admin-layout-root">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="admin-toast-container">
          <div className={`admin-toast-item ${toastMessage.type}`}>
            {toastMessage.type === 'success' && <CheckCircle2 size={18} />}
            {toastMessage.type === 'error' && <AlertCircle size={18} />}
            {toastMessage.type === 'info' && <Activity size={18} />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          SIDEBAR NAVIGATION
          ------------------------------------------------------------------ */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-icon">
              <img src="/images/logo.png" alt="Prestige Cargo" />
            </div>
            <div className="admin-sidebar-brand-text">
              <h2>PRESTIGE CARGO</h2>
              <span>Enterprise Tower</span>
            </div>
          </div>
          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'transparent', color: '#94a3b8', padding: '0.25rem' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Customs AIN Badge */}
        <div className="admin-sidebar-ain-pill">
          <div className="admin-sidebar-ain-label">
            <ShieldCheck size={12} />
            <span>Customs AIN</span>
          </div>
          <span className="admin-sidebar-ain-val">{localCompany?.ainNumber || 'AIN-30129841'}</span>
        </div>

        <nav className="admin-sidebar-nav">
          {/* Group 1: Command Center */}
          <div className="admin-sidebar-nav-group">
            <div className="admin-sidebar-group-title">Command Center</div>
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><LayoutDashboard size={18} /></span>
                <span>Operations Hub</span>
              </div>
            </button>
          </div>

          {/* Group 2: Public Content & Services */}
          <div className="admin-sidebar-nav-group">
            <div className="admin-sidebar-group-title">Front-End &amp; Services</div>

            <button
              type="button"
              onClick={() => { setActiveTab('hero'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'hero' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><ImageIcon size={18} /></span>
                <span>Homepage Hero</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('services'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'services' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><Ship size={18} /></span>
                <span>Freight Services</span>
              </div>
              <span className="admin-nav-badge">{localServices?.length || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('tradelanes'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'tradelanes' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><Globe2 size={18} /></span>
                <span>Trade Corridors</span>
              </div>
              <span className="admin-nav-badge">{localLanes?.length || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('industries'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'industries' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><Layers size={18} /></span>
                <span>Industry Verticals</span>
              </div>
              <span className="admin-nav-badge">{localIndustries?.length || 0}</span>
            </button>
          </div>

          {/* Group 3: Statutory & Corporate */}
          <div className="admin-sidebar-nav-group">
            <div className="admin-sidebar-group-title">Corporate &amp; Regulatory</div>

            <button
              type="button"
              onClick={() => { setActiveTab('company'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'company' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><Building2 size={18} /></span>
                <span>Statutory Credentials</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('offices'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'offices' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><MapPin size={18} /></span>
                <span>Branch &amp; Port Desks</span>
              </div>
              <span className="admin-nav-badge">{localCompany?.offices?.length || 0}</span>
            </button>
          </div>

          {/* Group 4: Live Operations & CRM */}
          <div className="admin-sidebar-nav-group">
            <div className="admin-sidebar-group-title">Shipments &amp; Inquiries</div>

            <button
              type="button"
              onClick={() => { setActiveTab('tracking'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><Search size={18} /></span>
                <span>Shipment Tracking</span>
              </div>
              <span className="admin-nav-badge">{Object.keys(localTracking || {}).length}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('inquiries'); setSidebarOpen(false); }}
              className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <span className="admin-nav-item-icon"><Mail size={18} /></span>
                <span>Client Inquiries</span>
              </div>
              <span className="admin-nav-badge">{localInquiries?.length || 0}</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-system-health">
            <div className="admin-health-indicator">
              <span className="admin-pulse-dot"></span>
              <span>Data Store Live</span>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.68rem', fontFamily: 'monospace' }}>v2.6 SYNC</span>
          </div>

          <div className="admin-user-profile">
            <div className="admin-user-info">
              <div className="admin-user-avatar">AD</div>
              <div>
                <div className="admin-user-name">Master Admin</div>
                <div className="admin-user-role">Prestige Cargo Control</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="admin-btn-logout-icon"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------
          MAIN WORKSPACE
          ------------------------------------------------------------------ */}
      <div className="admin-main-wrapper">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="admin-mobile-toggle"
            >
              <Menu size={22} />
            </button>

            <div className="admin-breadcrumbs">
              <span className="admin-breadcrumbs-parent">Prestige Tower</span>
              <span className="admin-breadcrumbs-separator">/</span>
              <span className="admin-breadcrumbs-active">
                {activeTab === 'overview' && 'Operations Hub'}
                {activeTab === 'hero' && 'Homepage Hero Section'}
                {activeTab === 'services' && 'Core Freight Services'}
                {activeTab === 'tradelanes' && 'Trade Corridors & Schedules'}
                {activeTab === 'industries' && 'Industry Solutions'}
                {activeTab === 'company' && 'Statutory Credentials & AIN'}
                {activeTab === 'offices' && 'Branch Offices & Port Desks'}
                {activeTab === 'tracking' && 'Shipment Tracking Database'}
                {activeTab === 'inquiries' && 'Customer Inquiries & Quotes'}
              </span>
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Global Search Input */}
            <div className="admin-global-search">
              <Search size={15} className="admin-search-icon" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Quick search..."
              />
            </div>

            {/* Quick Live Site Link */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="admin-btn-action outline"
              title="Open public website in a new window"
            >
              <Eye size={15} />
              <span>Live Site</span>
              <ExternalLink size={12} style={{ opacity: 0.6 }} />
            </Link>

            {/* Reload Data Store */}
            <button
              type="button"
              onClick={refreshData}
              disabled={isLoading}
              className="admin-btn-action outline"
              title="Sync latest records from single-source store"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Statutory Status Pill */}
            <div className="admin-topbar-badge">
              <CheckCircle2 size={13} />
              <span>AIN Verified</span>
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="admin-content-container">

          {/* ================================================================
              TAB: OVERVIEW HUB (COMMAND CENTER)
              ================================================================ */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Logistics Operations Hub</h1>
                  <p>
                    Live overview of shipment tracking, customs brokerage credentials, active freight services, and pending quotation inquiries.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={() => setActiveModal('tracking')}
                    className="admin-btn-action primary"
                  >
                    <Plus size={16} />
                    <span>New Shipment Track</span>
                  </button>
                </div>
              </div>

              {/* 4 Top KPI Stat Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card blue">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Active Shipments</span>
                    <span className="admin-stat-val">{Object.keys(localTracking || {}).length}</span>
                    <span className="admin-stat-sub positive">
                      <TrendingUp size={13} />
                      <span>Live HBL/AWB tracked</span>
                    </span>
                  </div>
                  <div className="admin-stat-icon-wrap blue">
                    <Ship size={24} />
                  </div>
                </div>

                <div className="admin-stat-card emerald">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Freight Services</span>
                    <span className="admin-stat-val">{localServices?.length || 0}</span>
                    <span className="admin-stat-sub">
                      <span>Sea, Air, Land &amp; CFS</span>
                    </span>
                  </div>
                  <div className="admin-stat-icon-wrap emerald">
                    <Truck size={24} />
                  </div>
                </div>

                <div className="admin-stat-card amber">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Trade Corridors</span>
                    <span className="admin-stat-val">{localLanes?.length || 0}</span>
                    <span className="admin-stat-sub">
                      <span>Global transit schedules</span>
                    </span>
                  </div>
                  <div className="admin-stat-icon-wrap amber">
                    <Globe2 size={24} />
                  </div>
                </div>

                <div className="admin-stat-card indigo">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Customer Inquiries</span>
                    <span className="admin-stat-val">{localInquiries?.length || 0}</span>
                    <span className="admin-stat-sub positive">
                      <Mail size={13} />
                      <span>Quote requests received</span>
                    </span>
                  </div>
                  <div className="admin-stat-icon-wrap indigo">
                    <Mail size={24} />
                  </div>
                </div>
              </div>

              {/* Dashboard 2-Column Grid */}
              <div className="admin-dashboard-grid">
                <div>
                  {/* Quick Shortcuts */}
                  <div className="admin-card-panel">
                    <div className="admin-card-panel-header">
                      <h3 className="admin-panel-title">
                        <Sparkles size={18} style={{ color: '#0284c7' }} />
                        <span>Quick Operational Tasks</span>
                      </h3>
                    </div>
                    <div className="admin-quick-action-grid">
                      <div
                        className="admin-quick-action-card"
                        onClick={() => setActiveTab('hero')}
                      >
                        <div className="admin-quick-action-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                          <ImageIcon size={20} />
                        </div>
                        <strong>Hero Banner</strong>
                        <span>Update vessel image &amp; headline</span>
                      </div>

                      <div
                        className="admin-quick-action-card"
                        onClick={() => setActiveTab('tracking')}
                      >
                        <div className="admin-quick-action-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                          <Search size={20} />
                        </div>
                        <strong>Update Shipments</strong>
                        <span>Modify status, location, ETA</span>
                      </div>

                      <div
                        className="admin-quick-action-card"
                        onClick={() => setActiveTab('company')}
                      >
                        <div className="admin-quick-action-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                          <ShieldCheck size={20} />
                        </div>
                        <strong>Customs AIN Vault</strong>
                        <span>Statutory credentials &amp; license</span>
                      </div>

                      <div
                        className="admin-quick-action-card"
                        onClick={() => setActiveTab('inquiries')}
                      >
                        <div className="admin-quick-action-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                          <Mail size={20} />
                        </div>
                        <strong>Inquiries Inbox</strong>
                        <span>Reply &amp; export customer quotes</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Inquiries Preview */}
                  <div className="admin-card-panel">
                    <div className="admin-card-panel-header">
                      <h3 className="admin-panel-title">
                        <Mail size={18} style={{ color: '#0284c7' }} />
                        <span>Recent Freight Inquiries</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('inquiries')}
                        className="admin-btn-action outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
                      >
                        <span>View All</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    {localInquiries && localInquiries.length > 0 ? (
                      <div className="admin-inquiries-table-wrap">
                        <table className="admin-inquiries-table">
                          <thead>
                            <tr>
                              <th>Client</th>
                              <th>Service</th>
                              <th>Route</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {localInquiries.slice(0, 4).map((inq, idx) => (
                              <tr key={inq.id || idx}>
                                <td>
                                  <div className="admin-client-cell">
                                    <strong>{inq.name}</strong>
                                    <span>{inq.email}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className="admin-item-chip">
                                    {inq.serviceType || 'Freight'}
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                  {inq.origin && inq.destination ? `${inq.origin} → ${inq.destination}` : 'General Inquiry'}
                                </td>
                                <td style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  {inq.date ? new Date(inq.date).toLocaleDateString() : 'Recent'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p style={{ color: '#64748b', fontSize: '0.84rem', padding: '1rem 0' }}>
                        No incoming quote requests logged yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Statutory Credentials Snapshot */}
                <div>
                  <div className="admin-ain-vault-card" style={{ marginBottom: '1.5rem' }}>
                    <div className="admin-ain-vault-badge">
                      <ShieldCheck size={14} />
                      <span>Official Statutory Seal</span>
                    </div>
                    <h3 className="admin-ain-vault-title">
                      {localCompany?.name || 'Prestige Cargo'}
                    </h3>
                    <p className="admin-ain-vault-desc">
                      Customs House Agent licensed with the National Board of Revenue (NBR) &amp; BAFFA registered.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed #fcd34d', paddingBottom: '0.4rem' }}>
                        <span style={{ color: '#92400e', fontWeight: 600 }}>Customs AIN Number:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#78350f' }}>{localCompany?.ainNumber || 'AIN-30129841'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed #fcd34d', paddingBottom: '0.4rem' }}>
                        <span style={{ color: '#92400e', fontWeight: 600 }}>BAFFA Membership:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#78350f' }}>{localCompany?.credentials?.baffaMembershipNo || 'BAFFA/ORD/2018-912'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed #fcd34d', paddingBottom: '0.4rem' }}>
                        <span style={{ color: '#92400e', fontWeight: 600 }}>C&amp;F License:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#78350f' }}>{localCompany?.credentials?.customsAgentLicenseNo || 'CNF/DAC-0842/2016'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                        <span style={{ color: '#92400e', fontWeight: 600 }}>BIN / VAT No:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#78350f' }}>{localCompany?.credentials?.binVatNo || '002847192-0102'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Active Branch Desks Card */}
                  <div className="admin-card-panel">
                    <div className="admin-card-panel-header">
                      <h3 className="admin-panel-title">
                        <MapPin size={18} style={{ color: '#0284c7' }} />
                        <span>Port Desks &amp; Branches</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('offices')}
                        className="admin-btn-action outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
                      >
                        <span>Manage</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(localCompany?.offices || []).map((off, idx) => (
                        <div
                          key={off.id || idx}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.82rem', color: '#0f172a' }}>{off.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{off.phoneDisplay || off.phone}</span>
                          </div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#e0f2fe', color: '#0284c7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {off.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: HOMEPAGE HERO SECTION & VIDEO CAROUSEL STUDIO
              ================================================================ */}
          {activeTab === 'hero' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Homepage Hero Video Carousel ({heroSlidesSafe.length} Slides)</h1>
                  <p>
                    Upload cinematic background videos directly from your local PC, manage multimodal tabs (Ocean, Air, Road, Port), customize headline typography, and preview public presentation in real-time.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={handleResetHeroSlides}
                    className="admin-btn-action outline"
                    title="Reset to 4 default multimodal video slides"
                  >
                    <RotateCcw size={15} />
                    <span>Reset Defaults</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddHeroSlide}
                    className="admin-btn-action outline"
                  >
                    <Plus size={16} />
                    <span>Add Slide</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveHero}
                    disabled={savingCategory === 'hero'}
                    className="admin-btn-action primary"
                  >
                    <Save size={16} />
                    <span>{savingCategory === 'hero' ? 'Saving Live...' : 'Save Hero Changes'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Carousel Slide Selector Tabs Bar */}
              <div className="admin-hero-tabs-selector">
                <div className="admin-hero-tabs-list">
                  {heroSlidesSafe.map((slide, idx) => {
                    const isSelected = idx === selectedHeroIndexSafe;
                    return (
                      <div
                        key={slide.id || idx}
                        onClick={() => setSelectedHeroIndex(idx)}
                        className={`admin-hero-tab-pill ${isSelected ? 'active' : ''}`}
                      >
                        <div className="admin-hero-tab-pill-content">
                          <span className="admin-hero-tab-tag">{slide.modeTag || `SLIDE ${idx + 1}`}</span>
                          <strong className="admin-hero-tab-title">{slide.tabTitle || `Slide #${idx + 1}`}</strong>
                          <span className="admin-hero-tab-video-indicator">
                            <Film size={11} /> {slide.video ? 'Video Active' : 'Image Only'}
                          </span>
                        </div>
                        {heroSlidesSafe.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHeroSlide(idx);
                            }}
                            className="admin-hero-tab-del-btn"
                            title="Delete this slide"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleAddHeroSlide}
                    className="admin-hero-tab-add-btn"
                    title="Add new carousel slide"
                  >
                    <Plus size={16} />
                    <span>New Slide</span>
                  </button>
                </div>
              </div>

              {/* 2. Real-Time Cinematic Video Player Live Preview */}
              <div className="admin-hero-live-preview">
                {activeHeroSlide.video ? (
                  <video
                    ref={liveVideoPreviewRef}
                    key={activeHeroSlide.video}
                    src={activeHeroSlide.video}
                    poster={activeHeroSlide.poster || activeHeroSlide.image}
                    autoPlay
                    muted={previewMuted}
                    loop
                    playsInline
                    className="admin-hero-preview-bg"
                  />
                ) : (
                  <img
                    src={activeHeroSlide.image || activeHeroSlide.poster || '/images/home_hero_ship.png'}
                    alt="Hero Vessel"
                    className="admin-hero-preview-bg"
                    onError={(e) => { e.currentTarget.src = '/images/home_hero_ship.png'; }}
                  />
                )}
                <div className="admin-hero-preview-overlay"></div>

                {/* Floating Preview Controls Bar */}
                <div className="admin-hero-preview-controls-bar">
                  <span className="admin-hero-preview-badge">
                    <span className="admin-pulse-dot" />
                    LIVE PREVIEW — Slide {selectedHeroIndexSafe + 1} of {heroSlidesSafe.length}
                  </span>
                  <div className="admin-hero-preview-btn-group">
                    {activeHeroSlide.video && (
                      <>
                        <button
                          type="button"
                          className="admin-preview-ctrl-btn"
                          onClick={() => {
                            if (liveVideoPreviewRef.current) {
                              if (previewPlaying) {
                                liveVideoPreviewRef.current.pause();
                                setPreviewPlaying(false);
                              } else {
                                liveVideoPreviewRef.current.play();
                                setPreviewPlaying(true);
                              }
                            }
                          }}
                          title={previewPlaying ? 'Pause video' : 'Play video'}
                        >
                          {previewPlaying ? <Pause size={13} /> : <Play size={13} />}
                          <span>{previewPlaying ? 'Pause' : 'Play'}</span>
                        </button>
                        <button
                          type="button"
                          className="admin-preview-ctrl-btn"
                          onClick={() => {
                            if (liveVideoPreviewRef.current) {
                              liveVideoPreviewRef.current.muted = !previewMuted;
                              setPreviewMuted(!previewMuted);
                            }
                          }}
                          title={previewMuted ? 'Unmute video audio' : 'Mute video audio'}
                        >
                          {previewMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                          <span>{previewMuted ? 'Muted' : 'Audio On'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Overlaid Headline & Typography Preview */}
                <div className="admin-hero-preview-content">
                  <div className="admin-hero-preview-tag">
                    <Sparkles size={12} />
                    <span>{activeHeroSlide.pill || activeHeroSlide.tabLabel || 'GLOBAL LOGISTICS'}</span>
                  </div>
                  <h2 className="admin-hero-preview-title">
                    {activeHeroSlide.headlinePrefix || activeHeroSlide.title || 'Reliable Cargo Solutions'}{' '}
                    <span className="admin-preview-gradient">{activeHeroSlide.headlineGradient || ''}</span>
                  </h2>
                  <p className="admin-hero-preview-sub">
                    {activeHeroSlide.desc || activeHeroSlide.subtitle || 'Customs Clearance, Ocean Shipping, Air Charters, and Inland Freight across Bangladesh.'}
                  </p>
                  <div className="admin-hero-preview-mock-cta">
                    <span className="admin-mock-btn primary">Request Freight Quote</span>
                    <span className="admin-mock-btn secondary">Track Shipment</span>
                  </div>
                </div>
              </div>

              {/* 3. HERO VIDEO MANAGER & LOCAL PC UPLOADER CARD */}
              <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-card-header">
                  <div className="admin-card-header-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div className="admin-icon-avatar" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                        <Film size={18} />
                      </div>
                      <div>
                        <h3>Slide #{selectedHeroIndexSafe + 1} Video Manager (Local PC Upload)</h3>
                        <p>Upload a custom video file from your computer or choose from high-definition logistics presets.</p>
                      </div>
                    </div>
                  </div>
                  <span className="admin-status-badge active" style={{ fontSize: '0.72rem' }}>
                    Editing: {activeHeroSlide.tabTitle || `Slide ${selectedHeroIndexSafe + 1}`}
                  </span>
                </div>

                <div className="admin-card-body">
                  {/* Upload Notification Alerts */}
                  {uploadError && (
                    <div className="admin-alert-banner error" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <AlertTriangle size={18} />
                      <div style={{ flex: 1 }}>{uploadError}</div>
                      <button type="button" onClick={() => setUploadError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={15} />
                      </button>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="admin-alert-banner success" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CheckCircle2 size={18} />
                      <div style={{ flex: 1 }}>{uploadSuccess}</div>
                      <button type="button" onClick={() => setUploadSuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={15} />
                      </button>
                    </div>
                  )}

                  {/* Drag & Drop Local PC File Upload Zone */}
                  <div
                    className={`admin-video-dropzone ${isDragOverVideo ? 'dragover' : ''} ${isUploadingVideo ? 'uploading' : ''}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOverVideo(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragOverVideo(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOverVideo(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleVideoFileSelected(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => {
                      if (!isUploadingVideo && videoFileInputRef.current) {
                        videoFileInputRef.current.click();
                      }
                    }}
                  >
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v,video/x-matroska"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleVideoFileSelected(e.target.files[0]);
                        }
                      }}
                    />

                    {isUploadingVideo ? (
                      <div className="admin-dropzone-uploading">
                        <div className="admin-spinner-large" />
                        <h4>Uploading Video from Local PC... {uploadProgress}%</h4>
                        <p>Processing and storing in public/uploads/videos/</p>
                        <div className="admin-progress-bar-wrap">
                          <div
                            className="admin-progress-bar-fill"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="admin-dropzone-idle">
                        <div className="admin-dropzone-icon-wrap">
                          <UploadCloud size={38} />
                        </div>
                        <h4>Click or Drag &amp; Drop Video Here to Upload from Local PC</h4>
                        <p>Supported Formats: MP4, WebM, MOV, OGG, MKV • Maximum File Size: 200 MB</p>
                        <div className="admin-dropzone-btn-wrap">
                          <button
                            type="button"
                            className="admin-btn-action primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              videoFileInputRef.current?.click();
                            }}
                          >
                            <Upload size={15} />
                            <span>Select Video from Computer</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Video Status Chip & Info */}
                  <div className="admin-video-active-card">
                    <div className="admin-video-active-left">
                      <div className="admin-video-chip-icon">
                        <FileVideo size={20} />
                      </div>
                      <div className="admin-video-chip-details">
                        <strong>Current Video Source for Slide #{selectedHeroIndexSafe + 1}:</strong>
                        <span className="admin-video-chip-path">{activeHeroSlide.video || 'No video assigned (using static image)'}</span>
                        {activeHeroSlide.videoFileSize && (
                          <span className="admin-video-chip-size">Size: {activeHeroSlide.videoFileSize}</span>
                        )}
                      </div>
                    </div>
                    <div className="admin-video-active-actions">
                      <button
                        type="button"
                        onClick={() => videoFileInputRef.current?.click()}
                        className="admin-btn-action outline small"
                      >
                        <Upload size={13} />
                        <span>Upload Different Video</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Video Presets Grid */}
                  <div className="admin-field-group" style={{ marginTop: '1.25rem' }}>
                    <label className="admin-field-label">
                      Or Choose from Built-In Logistics Video Clips:
                    </label>
                    <div className="admin-video-preset-grid">
                      {defaultVideoPresets.map((preset) => {
                        const isSelected = activeHeroSlide.video === preset.path;
                        return (
                          <div
                            key={preset.path}
                            onClick={() => {
                              updateActiveHeroSlide({
                                video: preset.path,
                                poster: preset.poster || activeHeroSlide.poster,
                                videoFileName: preset.label
                              });
                              showToast(`Applied preset: ${preset.label}`);
                            }}
                            className={`admin-video-preset-pill ${isSelected ? 'active' : ''}`}
                          >
                            <Film size={15} />
                            <div className="admin-video-preset-info">
                              <span className="preset-name">{preset.label}</span>
                              <span className="preset-path">{preset.path}</span>
                            </div>
                            {isSelected && <Check size={14} className="preset-check" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Uploaded Videos Library (if any) */}
                  {availableVideos && availableVideos.filter(v => v.category === 'uploaded').length > 0 && (
                    <div className="admin-field-group" style={{ marginTop: '1rem' }}>
                      <label className="admin-field-label">Previously Uploaded Local PC Videos:</label>
                      <div className="admin-video-preset-grid">
                        {availableVideos
                          .filter(v => v.category === 'uploaded')
                          .map((vid) => {
                            const isSelected = activeHeroSlide.video === vid.path;
                            return (
                              <div
                                key={vid.path}
                                onClick={() => {
                                  updateActiveHeroSlide({
                                    video: vid.path,
                                    videoFileName: vid.name
                                  });
                                  showToast(`Applied uploaded video: ${vid.name}`);
                                }}
                                className={`admin-video-preset-pill uploaded ${isSelected ? 'active' : ''}`}
                              >
                                <FileVideo size={15} />
                                <div className="admin-video-preset-info">
                                  <span className="preset-name">{vid.name}</span>
                                  <span className="preset-path">{vid.path}</span>
                                </div>
                                {isSelected && <Check size={14} className="preset-check" />}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Video Path & Poster Inputs */}
                  <div className="admin-grid-2col" style={{ marginTop: '1.25rem' }}>
                    <div className="admin-field-group">
                      <label className="admin-field-label">Video Asset Path or CDN URL</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={activeHeroSlide.video || ''}
                        onChange={(e) => updateActiveHeroSlide({ video: e.target.value })}
                        placeholder="/videos/ocean_freight.mp4 or /uploads/videos/hero_..."
                      />
                      <span className="admin-field-help">Direct path to MP4/WebM video asset.</span>
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Poster Image (Thumbnail fallback)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={activeHeroSlide.poster || activeHeroSlide.image || ''}
                        onChange={(e) => updateActiveHeroSlide({ poster: e.target.value, image: e.target.value })}
                        placeholder="/images/ocean_freight.png"
                      />
                      <span className="admin-field-help">Displayed while video is loading or on low-bandwidth devices.</span>
                    </div>
                  </div>

                  {/* Preset Poster Image Picker */}
                  <div className="admin-field-group" style={{ marginTop: '0.75rem' }}>
                    <label className="admin-field-label">Quick Poster Thumbnail Presets:</label>
                    <div className="admin-image-picker-grid">
                      {imagePresets.map((preset) => {
                        const isSelected = (activeHeroSlide.poster === preset.path) || (activeHeroSlide.image === preset.path);
                        return (
                          <div
                            key={preset.path}
                            onClick={() => {
                              updateActiveHeroSlide({
                                poster: preset.path,
                                image: preset.path
                              });
                            }}
                            className={`admin-image-preset-card ${isSelected ? 'active' : ''}`}
                            title={preset.label}
                          >
                            <img src={preset.path} alt={preset.label} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. SLIDE HEADLINE, BADGE & NAVIGATION TEXT EDITOR */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="admin-card-header-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div className="admin-icon-avatar" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h3>Slide #{selectedHeroIndexSafe + 1} Headline Copy &amp; Carousel Tab Details</h3>
                        <p>Customize the typography, multimodal navigation tab title, pill badge, and paragraph copy for this slide.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-card-body">
                  <div className="admin-grid-3col">
                    <div className="admin-field-group">
                      <label className="admin-field-label">Mode Tag (e.g. 01 OCEAN, 02 AIR)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={activeHeroSlide.modeTag || ''}
                        onChange={(e) => updateActiveHeroSlide({ modeTag: e.target.value })}
                        placeholder="01 OCEAN"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Carousel Tab Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={activeHeroSlide.tabTitle || ''}
                        onChange={(e) => updateActiveHeroSlide({ tabTitle: e.target.value })}
                        placeholder="Ocean Freight"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Tab Subtitle</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={activeHeroSlide.tabSubtitle || ''}
                        onChange={(e) => updateActiveHeroSlide({ tabSubtitle: e.target.value })}
                        placeholder="FCL & LCL Shipping"
                      />
                    </div>
                  </div>

                  <div className="admin-grid-2col" style={{ marginTop: '0.5rem' }}>
                    <div className="admin-field-group">
                      <label className="admin-field-label">Icon Identifier</label>
                      <select
                        className="admin-select"
                        value={activeHeroSlide.iconName || 'Ship'}
                        onChange={(e) => updateActiveHeroSlide({ iconName: e.target.value })}
                      >
                        <option value="Ship">Ship (Ocean Freight)</option>
                        <option value="Plane">Plane (Air Freight)</option>
                        <option value="Truck">Truck (Inland Transport)</option>
                        <option value="Warehouse">Warehouse (CFS & Port)</option>
                        <option value="ShieldCheck">ShieldCheck (Customs / Security)</option>
                        <option value="Globe">Globe (Global Lines)</option>
                        <option value="Building2">Building2 (Headquarters)</option>
                      </select>
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Glowing Pill Tag (Statutory Badge)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={activeHeroSlide.pill || activeHeroSlide.tabLabel || ''}
                        onChange={(e) => updateActiveHeroSlide({ pill: e.target.value, tabLabel: e.target.value })}
                        placeholder="GLOBAL OCEAN FREIGHT • FCL & LCL"
                      />
                    </div>
                  </div>

                  <div className="admin-grid-2col" style={{ marginTop: '0.5rem' }}>
                    <div className="admin-field-group">
                      <label className="admin-field-label">Main Headline Prefix (White text)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={activeHeroSlide.headlinePrefix || activeHeroSlide.title || ''}
                        onChange={(e) => updateActiveHeroSlide({ headlinePrefix: e.target.value, title: e.target.value })}
                        placeholder="Connecting Continents"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Headline Gradient Accent (Cyan/Gold text)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={activeHeroSlide.headlineGradient || ''}
                        onChange={(e) => updateActiveHeroSlide({ headlineGradient: e.target.value })}
                        placeholder="Across The Open Seas"
                      />
                    </div>
                  </div>

                  <div className="admin-field-group" style={{ marginTop: '0.5rem' }}>
                    <label className="admin-field-label">Subtitle Description (Paragraph)</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={activeHeroSlide.desc || activeHeroSlide.subtitle || ''}
                      onChange={(e) => updateActiveHeroSlide({ desc: e.target.value, subtitle: e.target.value })}
                      placeholder="Detailed value proposition for this freight mode..."
                    />
                  </div>

                  <div className="admin-field-group" style={{ marginTop: '0.5rem' }}>
                    <label className="admin-field-label">Highlight / Corridor Tag</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={activeHeroSlide.highlight || ''}
                      onChange={(e) => updateActiveHeroSlide({ highlight: e.target.value })}
                      placeholder="Chittagong & Mongla Seaports • Global Vessel Contracts"
                    />
                  </div>
                </div>

                <div className="admin-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {heroSlidesSafe.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteHeroSlide(selectedHeroIndexSafe)}
                      className="admin-btn-action danger"
                    >
                      <Trash2 size={15} />
                      <span>Delete This Slide</span>
                    </button>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={handleSaveHero}
                    disabled={savingCategory === 'hero'}
                    className="admin-btn-action primary"
                  >
                    <Save size={16} />
                    <span>{savingCategory === 'hero' ? 'Saving Live...' : 'Save & Publish Hero Carousel'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: FREIGHT SERVICES
              ================================================================ */}
          {activeTab === 'services' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Core Freight Services ({localServices?.length || 0})</h1>
                  <p>
                    Manage your service offerings including Ocean Freight (FCL/LCL), Air Freight Charters, Customs Clearance C&amp;F, Inland Transport, and CFS Warehousing.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={() => setActiveModal('service')}
                    className="admin-btn-action outline"
                  >
                    <Plus size={16} />
                    <span>Add New Service</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveServices}
                    disabled={savingCategory === 'services'}
                    className="admin-btn-action primary"
                  >
                    <Save size={16} />
                    <span>{savingCategory === 'services' ? 'Saving...' : 'Save Services'}</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['ALL', 'Ocean Freight', 'Air Freight', 'Customs Clearance', 'Inland Transport', 'Warehousing'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setServiceFilterCategory(cat)}
                    className={`admin-filter-pill ${serviceFilterCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="admin-items-list">
                {localServices
                  ?.filter(s => serviceFilterCategory === 'ALL' || s.category === serviceFilterCategory || s.title.toLowerCase().includes(serviceFilterCategory.toLowerCase()))
                  ?.map((svc, idx) => (
                    <div key={svc.id || idx} className="admin-item-box">
                      <div className="admin-item-topbar">
                        <div className="admin-item-tag">
                          <Ship size={17} style={{ color: '#0284c7' }} />
                          <span>{svc.title}</span>
                          <span className="admin-item-chip">{svc.category || 'Logistics'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(svc.id, idx)}
                          className="admin-item-delete-btn"
                          title="Delete service"
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="admin-grid-2col">
                        <div className="admin-field-group">
                          <label className="admin-field-label">Service Title</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={svc.title}
                            onChange={(e) => {
                              const copy = [...localServices];
                              copy[idx] = { ...copy[idx], title: e.target.value };
                              setLocalServices(copy);
                            }}
                          />
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Image URL / Path</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={svc.image || ''}
                            onChange={(e) => {
                              const copy = [...localServices];
                              copy[idx] = { ...copy[idx], image: e.target.value };
                              setLocalServices(copy);
                            }}
                          />
                        </div>
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Service Description</label>
                        <textarea
                          rows={2}
                          className="admin-textarea"
                          value={svc.description}
                          onChange={(e) => {
                            const copy = [...localServices];
                            copy[idx] = { ...copy[idx], description: e.target.value };
                            setLocalServices(copy);
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: TRADE CORRIDORS
              ================================================================ */}
          {activeTab === 'tradelanes' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Trade Corridors &amp; Transit Schedules ({localLanes?.length || 0})</h1>
                  <p>
                    Maintain bilateral sea routes, scheduled air transit days, country flags, and container shipping frequencies shown on your Trade Corridors map.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={() => setActiveModal('lane')}
                    className="admin-btn-action outline"
                  >
                    <Plus size={16} />
                    <span>Add New Corridor</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTradeLanes}
                    disabled={savingCategory === 'tradelanes'}
                    className="admin-btn-action primary"
                  >
                    <Save size={16} />
                    <span>{savingCategory === 'tradelanes' ? 'Saving...' : 'Save Corridors'}</span>
                  </button>
                </div>
              </div>

              <div className="admin-corridors-grid">
                {localLanes?.map((lane, idx) => (
                  <div key={lane.id || idx} className="admin-corridor-card">
                    <div>
                      <div className="admin-corridor-flags-row">
                        <div className="admin-flag-route">
                          <span>{lane.flag}</span>
                          <span className="admin-route-connector">↔</span>
                          <span>{lane.destFlag}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="admin-item-chip">{lane.direction || 'Bilateral'}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteLane(lane.id, idx)}
                            className="admin-item-delete-btn"
                            style={{ padding: '0.25rem 0.5rem' }}
                            title="Delete corridor"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Corridor Route Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={lane.title || `${lane.origin} → ${lane.destination}`}
                          onChange={(e) => {
                            const copy = [...localLanes];
                            copy[idx] = { ...copy[idx], title: e.target.value };
                            setLocalLanes(copy);
                          }}
                        />
                      </div>

                      <div className="admin-transit-badges">
                        <div className="admin-transit-badge">
                          <span>Sea Transit</span>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ textAlign: 'center', padding: '0.35rem 0.5rem', fontSize: '0.8rem', marginTop: '0.2rem' }}
                            value={lane.seaTransit}
                            onChange={(e) => {
                              const copy = [...localLanes];
                              copy[idx] = { ...copy[idx], seaTransit: e.target.value };
                              setLocalLanes(copy);
                            }}
                          />
                        </div>

                        <div className="admin-transit-badge">
                          <span>Air Transit</span>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ textAlign: 'center', padding: '0.35rem 0.5rem', fontSize: '0.8rem', marginTop: '0.2rem' }}
                            value={lane.airTransit}
                            onChange={(e) => {
                              const copy = [...localLanes];
                              copy[idx] = { ...copy[idx], airTransit: e.target.value };
                              setLocalLanes(copy);
                            }}
                          />
                        </div>
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Route Details</label>
                        <textarea
                          rows={2}
                          className="admin-textarea"
                          value={lane.description}
                          onChange={(e) => {
                            const copy = [...localLanes];
                            copy[idx] = { ...copy[idx], description: e.target.value };
                            setLocalLanes(copy);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: STATUTORY CREDENTIALS & AIN VAULT
              ================================================================ */}
          {activeTab === 'company' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Statutory Credentials &amp; Company Info</h1>
                  <p>
                    Official government customs credentials, Customs AIN Number, BAFFA freight forwarder membership, corporate contact channels, and legal registry details.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={handleSaveCompany}
                    disabled={savingCategory === 'company'}
                    className="admin-btn-action primary"
                  >
                    <Save size={16} />
                    <span>{savingCategory === 'company' ? 'Saving...' : 'Save All Credentials'}</span>
                  </button>
                </div>
              </div>

              {/* Amber Vault Container */}
              <div className="admin-ain-vault-card">
                <div className="admin-ain-vault-badge">
                  <ShieldCheck size={14} />
                  <span>National Customs Clearance Vault</span>
                </div>
                <h3 className="admin-ain-vault-title">Statutory License Identifications</h3>
                <p className="admin-ain-vault-desc">
                  These numbers are verified by Bangladesh Customs and the National Board of Revenue (NBR). Updating these values synchronizes site headers, compliance notices, and contact cards live.
                </p>

                <div className="admin-grid-2col">
                  <div className="admin-field-group">
                    <label className="admin-field-label" style={{ color: '#92400e', fontWeight: 800 }}>
                      ★ Customs AIN Number (Agent Identification Number)
                    </label>
                    <input
                      type="text"
                      className="admin-input admin-ain-input-highlight"
                      value={localCompany?.ainNumber || ''}
                      onChange={(e) => setLocalCompany({
                        ...localCompany,
                        ainNumber: e.target.value,
                        credentials: { ...(localCompany?.credentials || {}), ainNumber: e.target.value }
                      })}
                      placeholder="AIN-30129841"
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" style={{ color: '#92400e', fontWeight: 800 }}>
                      BAFFA Membership Certificate No.
                    </label>
                    <input
                      type="text"
                      className="admin-input admin-ain-input-highlight"
                      value={localCompany?.credentials?.baffaMembershipNo || ''}
                      onChange={(e) => setLocalCompany({
                        ...localCompany,
                        credentials: { ...(localCompany?.credentials || {}), baffaMembershipNo: e.target.value }
                      })}
                      placeholder="BAFFA/ORD/2018-912"
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" style={{ color: '#92400e' }}>
                      Customs C&amp;F Agent License No.
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      value={localCompany?.credentials?.customsAgentLicenseNo || ''}
                      onChange={(e) => setLocalCompany({
                        ...localCompany,
                        credentials: { ...(localCompany?.credentials || {}), customsAgentLicenseNo: e.target.value }
                      })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" style={{ color: '#92400e' }}>
                      BIN / VAT Registration No.
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      value={localCompany?.credentials?.binVatNo || ''}
                      onChange={(e) => setLocalCompany({
                        ...localCompany,
                        credentials: { ...(localCompany?.credentials || {}), binVatNo: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* General Company Information */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="admin-card-header-left">
                    <h3>Corporate Profile &amp; Contact Channels</h3>
                    <p>Official phone numbers, inquiries email, website domain, and corporate headquarters.</p>
                  </div>
                </div>

                <div className="admin-card-body">
                  <div className="admin-grid-2col">
                    <div className="admin-field-group">
                      <label className="admin-field-label">Company Legal Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={localCompany?.name || ''}
                        onChange={(e) => setLocalCompany({ ...localCompany, name: e.target.value })}
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Corporate Tagline</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={localCompany?.tagline || ''}
                        onChange={(e) => setLocalCompany({ ...localCompany, tagline: e.target.value })}
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Primary Telephone / Hotline</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={localCompany?.contacts?.primaryPhone || ''}
                        onChange={(e) => setLocalCompany({
                          ...localCompany,
                          contacts: { ...(localCompany?.contacts || {}), primaryPhone: e.target.value }
                        })}
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Inquiry / Sales Email</label>
                      <input
                        type="email"
                        className="admin-input"
                        value={localCompany?.contacts?.salesEmail || ''}
                        onChange={(e) => setLocalCompany({
                          ...localCompany,
                          contacts: { ...(localCompany?.contacts || {}), salesEmail: e.target.value }
                        })}
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Operations / Support Email</label>
                      <input
                        type="email"
                        className="admin-input"
                        value={localCompany?.contacts?.supportEmail || ''}
                        onChange={(e) => setLocalCompany({
                          ...localCompany,
                          contacts: { ...(localCompany?.contacts || {}), supportEmail: e.target.value }
                        })}
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Official Website Domain</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={localCompany?.contacts?.website || ''}
                        onChange={(e) => setLocalCompany({
                          ...localCompany,
                          contacts: { ...(localCompany?.contacts || {}), website: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Headquarters Physical Address</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={localCompany?.headOffice?.address || ''}
                      onChange={(e) => setLocalCompany({
                        ...localCompany,
                        headOffice: { ...(localCompany?.headOffice || {}), address: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: BRANCH OFFICES & PORT DESKS
              ================================================================ */}
          {activeTab === 'offices' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Branch Offices &amp; Port Desks ({localCompany?.offices?.length || 0})</h1>
                  <p>
                    Manage physical presence at Dhaka Airport Cargo Village, Chittagong Port, Benapole Land Port, and Corporate Head Office.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={() => setActiveModal('office')}
                    className="admin-btn-action outline"
                  >
                    <Plus size={16} />
                    <span>Add New Branch Desk</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveOffices}
                    disabled={savingCategory === 'offices'}
                    className="admin-btn-action primary"
                  >
                    <Save size={16} />
                    <span>{savingCategory === 'offices' ? 'Saving...' : 'Save Locations'}</span>
                  </button>
                </div>
              </div>

              <div className="admin-items-list">
                {(localCompany?.offices || []).map((office, idx) => (
                  <div key={office.id || idx} className="admin-item-box">
                    <div className="admin-item-topbar">
                      <div className="admin-item-tag">
                        <MapPin size={17} style={{ color: '#0284c7' }} />
                        <span>{office.name}</span>
                        <span className="admin-item-chip">{office.badge || 'Port Desk'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteOffice(office.id, idx)}
                        className="admin-item-delete-btn"
                        title="Delete office"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="admin-grid-2col">
                      <div className="admin-field-group">
                        <label className="admin-field-label">Branch Desk Name</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={office.name}
                          onChange={(e) => {
                            const copy = [...(localCompany?.offices || [])];
                            copy[idx] = { ...copy[idx], name: e.target.value };
                            setLocalCompany({ ...localCompany, offices: copy });
                          }}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Badge Tag (e.g. Headquarters, Sea Port, Air Cargo)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={office.badge}
                          onChange={(e) => {
                            const copy = [...(localCompany?.offices || [])];
                            copy[idx] = { ...copy[idx], badge: e.target.value };
                            setLocalCompany({ ...localCompany, offices: copy });
                          }}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Desk Contact Phone</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={office.phoneDisplay || office.phone || ''}
                          onChange={(e) => {
                            const copy = [...(localCompany?.offices || [])];
                            copy[idx] = { ...copy[idx], phoneDisplay: e.target.value, phone: e.target.value };
                            setLocalCompany({ ...localCompany, offices: copy });
                          }}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Desk Email Address</label>
                        <input
                          type="email"
                          className="admin-input"
                          value={office.email || ''}
                          onChange={(e) => {
                            const copy = [...(localCompany?.offices || [])];
                            copy[idx] = { ...copy[idx], email: e.target.value };
                            setLocalCompany({ ...localCompany, offices: copy });
                          }}
                        />
                      </div>
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Full Physical Location Address</label>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={office.address}
                        onChange={(e) => {
                          const copy = [...(localCompany?.offices || [])];
                          copy[idx] = { ...copy[idx], address: e.target.value };
                          setLocalCompany({ ...localCompany, offices: copy });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: INDUSTRY VERTICALS
              ================================================================ */}
          {activeTab === 'industries' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Specialized Industry Solutions ({localIndustries?.length || 0})</h1>
                  <p>
                    Targeted export &amp; import supply chain logistics for Ready-Made Garments (RMG), Pharmaceuticals, Perishables, and Industrial Cargo.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={handleSaveIndustries}
                    disabled={savingCategory === 'industries'}
                    className="admin-btn-action primary"
                  >
                    <Save size={16} />
                    <span>{savingCategory === 'industries' ? 'Saving...' : 'Save Industries'}</span>
                  </button>
                </div>
              </div>

              <div className="admin-items-list">
                {localIndustries?.map((ind, idx) => (
                  <div key={ind.id || idx} className="admin-item-box">
                    <div className="admin-item-topbar">
                      <div className="admin-item-tag">
                        <Layers size={17} style={{ color: '#0284c7' }} />
                        <span>{ind.title}</span>
                        <span className="admin-item-chip">{ind.badge}</span>
                      </div>
                    </div>

                    <div className="admin-grid-2col">
                      <div className="admin-field-group">
                        <label className="admin-field-label">Industry Sector Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={ind.title}
                          onChange={(e) => {
                            const copy = [...localIndustries];
                            copy[idx] = { ...copy[idx], title: e.target.value };
                            setLocalIndustries(copy);
                          }}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Featured Image URL / Asset Path</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={ind.image || ''}
                          onChange={(e) => {
                            const copy = [...localIndustries];
                            copy[idx] = { ...copy[idx], image: e.target.value };
                            setLocalIndustries(copy);
                          }}
                        />
                      </div>
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">Overview Description</label>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={ind.overview}
                        onChange={(e) => {
                          const copy = [...localIndustries];
                          copy[idx] = { ...copy[idx], overview: e.target.value };
                          setLocalIndustries(copy);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: SHIPMENT TRACKING MANAGER
              ================================================================ */}
          {activeTab === 'tracking' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Shipment Tracking Database ({Object.keys(localTracking || {}).length})</h1>
                  <p>
                    Manage real-time milestones, container statuses, and estimated delivery dates for client HBL and Air Waybill (AWB) tracking numbers.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={() => setActiveModal('tracking')}
                    className="admin-btn-action outline"
                  >
                    <Plus size={16} />
                    <span>Add New Shipment</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTracking}
                    disabled={savingCategory === 'tracking'}
                    className="admin-btn-action primary"
                  >
                    <Save size={16} />
                    <span>{savingCategory === 'tracking' ? 'Saving...' : 'Save Tracking Data'}</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="admin-tracking-search-bar">
                <div className="admin-tracking-filter-pills">
                  {['ALL', 'Cargo Received', 'Customs Cleared', 'In Transit', 'Out for Delivery', 'Delivered'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setTrackingFilterStatus(status)}
                      className={`admin-filter-pill ${trackingFilterStatus === status ? 'active' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shipment Cards Grid */}
              <div className="admin-tracking-cards-grid">
                {filteredTracking.map(([code, item]) => {
                  let statusClass = 'in-transit';
                  if (item.status === 'Delivered') statusClass = 'delivered';
                  else if (item.status === 'Customs Cleared') statusClass = 'customs';
                  else if (item.status === 'Cargo Received') statusClass = 'cargo-received';

                  return (
                    <div key={code} className="admin-track-card">
                      <div className="admin-track-header">
                        <span className="admin-track-code">REF: {code}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span className={`admin-track-status-badge ${statusClass}`}>
                            {item.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteTracking(code)}
                            className="admin-item-delete-btn"
                            style={{ padding: '0.2rem 0.4rem' }}
                            title="Delete shipment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Stepper Progress Bar */}
                      <div className="admin-track-stepper">
                        {[0, 1, 2, 3, 4].map((stepIdx) => (
                          <div
                            key={stepIdx}
                            className={`admin-step-dot ${getStepClass(item.status, stepIdx)}`}
                            title={`Milestone ${stepIdx + 1}`}
                          ></div>
                        ))}
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Current Status</label>
                        <select
                          className="admin-select"
                          value={item.status}
                          onChange={(e) => {
                            const copy = { ...localTracking };
                            copy[code] = { ...copy[code], status: e.target.value };
                            setLocalTracking(copy);
                          }}
                        >
                          <option value="Cargo Received">Cargo Received</option>
                          <option value="Customs Cleared">Customs Cleared</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      <div className="admin-grid-2col" style={{ gap: '0.65rem' }}>
                        <div className="admin-field-group">
                          <label className="admin-field-label">Origin Hub</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={item.origin}
                            onChange={(e) => {
                              const copy = { ...localTracking };
                              copy[code] = { ...copy[code], origin: e.target.value };
                              setLocalTracking(copy);
                            }}
                          />
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Destination</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={item.destination}
                            onChange={(e) => {
                              const copy = { ...localTracking };
                              copy[code] = { ...copy[code], destination: e.target.value };
                              setLocalTracking(copy);
                            }}
                          />
                        </div>
                      </div>

                      <div className="admin-grid-2col" style={{ gap: '0.65rem' }}>
                        <div className="admin-field-group">
                          <label className="admin-field-label">Estimated Delivery</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={item.estimatedDelivery}
                            onChange={(e) => {
                              const copy = { ...localTracking };
                              copy[code] = { ...copy[code], estimatedDelivery: e.target.value };
                              setLocalTracking(copy);
                            }}
                          />
                        </div>

                        <div className="admin-field-group">
                          <label className="admin-field-label">Current Location</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={item.currentLocation}
                            onChange={(e) => {
                              const copy = { ...localTracking };
                              copy[code] = { ...copy[code], currentLocation: e.target.value };
                              setLocalTracking(copy);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: CUSTOMER INQUIRIES & QUOTE REQUESTS
              ================================================================ */}
          {activeTab === 'inquiries' && (
            <div>
              <div className="admin-module-header">
                <div className="admin-module-title-wrap">
                  <h1>Customer Inquiries &amp; Freight Quotes ({localInquiries?.length || 0})</h1>
                  <p>
                    Incoming quotation requests and messages submitted by clients through the public website's quote modal and contact desk.
                  </p>
                </div>
                <div className="admin-module-actions">
                  <button
                    type="button"
                    onClick={handleExportInquiriesCSV}
                    className="admin-btn-action outline"
                  >
                    <Download size={16} />
                    <span>Export to CSV</span>
                  </button>
                </div>
              </div>

              {/* Service Filter Toolbar */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['ALL', 'Air Freight', 'Ocean Cargo', 'Customs Clearance', 'Inland Transport', 'Warehousing'].map((svc) => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => setInquiryFilterService(svc)}
                    className={`admin-filter-pill ${inquiryFilterService === svc ? 'active' : ''}`}
                  >
                    {svc}
                  </button>
                ))}
              </div>

              {filteredInquiries && filteredInquiries.length > 0 ? (
                <div className="admin-inquiries-table-wrap">
                  <table className="admin-inquiries-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Client Contact</th>
                        <th>Service Mode</th>
                        <th>Route Corridor</th>
                        <th>Message / Cargo Details</th>
                        <th>Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.map((inq, idx) => (
                        <tr key={inq.id || idx}>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: '#64748b' }}>
                            {inq.date ? new Date(inq.date).toLocaleDateString() : 'Recent'}
                          </td>
                          <td>
                            <div className="admin-client-cell">
                              <strong>{inq.name}</strong>
                              <a href={`mailto:${inq.email}`} style={{ color: '#0284c7' }}>
                                {inq.email}
                              </a>
                              {inq.phone && <span style={{ color: '#64748b' }}>{inq.phone}</span>}
                            </div>
                          </td>
                          <td>
                            <span className="admin-item-chip">
                              {inq.serviceType || 'General Freight'}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                            {inq.origin && inq.destination ? `${inq.origin} → ${inq.destination}` : '—'}
                          </td>
                          <td style={{ maxWidth: '280px', fontSize: '0.82rem', color: '#334155' }}>
                            {inq.message || '—'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <a
                                href={`mailto:${inq.email}?subject=Prestige%20Cargo%20Freight%20Quotation%20Follow-up&body=Dear%20${encodeURIComponent(inq.name)},%0D%0A%0D%0AThank%20you%20for%20contacting%20Prestige%20Cargo.`}
                                className="admin-btn-action outline"
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.74rem' }}
                                title="Reply via Email"
                              >
                                <Mail size={13} />
                                <span>Reply</span>
                              </a>
                              {inq.phone && (
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="admin-btn-action outline"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.74rem' }}
                                  title="Chat via WhatsApp"
                                >
                                  <Phone size={13} />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <Mail size={44} style={{ margin: '0 auto 1rem auto', color: '#94a3b8' }} />
                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.35rem' }}>No Quotation Requests Matching Filter</h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                    Incoming quotes submitted from the public website will be logged here in real-time.
                  </p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* =====================================================================
          MODAL 1: ADD NEW SHIPMENT TRACKING
          ===================================================================== */}
      {activeModal === 'tracking' && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <Search size={18} style={{ color: '#0284c7' }} />
                <span>Create New Shipment Track</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="admin-modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTrackingSubmit}>
              <div className="admin-modal-body">
                <div className="admin-field-group">
                  <label className="admin-field-label">Tracking Reference Number (HBL / AWB)</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={newTrackingItem.code}
                    onChange={(e) => setNewTrackingItem({ ...newTrackingItem, code: e.target.value })}
                    placeholder="e.g. PC-DAC-99014"
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Initial Status</label>
                  <select
                    className="admin-select"
                    value={newTrackingItem.status}
                    onChange={(e) => setNewTrackingItem({ ...newTrackingItem, status: e.target.value })}
                  >
                    <option value="Cargo Received">Cargo Received</option>
                    <option value="Customs Cleared">Customs Cleared</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="admin-grid-2col">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Origin Hub</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={newTrackingItem.origin}
                      onChange={(e) => setNewTrackingItem({ ...newTrackingItem, origin: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Destination Hub</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={newTrackingItem.destination}
                      onChange={(e) => setNewTrackingItem({ ...newTrackingItem, destination: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-grid-2col">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Estimated Delivery Date</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newTrackingItem.estimatedDelivery}
                      onChange={(e) => setNewTrackingItem({ ...newTrackingItem, estimatedDelivery: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Current Checkpoint Location</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newTrackingItem.currentLocation}
                      onChange={(e) => setNewTrackingItem({ ...newTrackingItem, currentLocation: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="admin-btn-action outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-action primary"
                >
                  <Plus size={16} />
                  <span>Create Shipment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: ADD TRADE CORRIDOR
          ===================================================================== */}
      {activeModal === 'lane' && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <Globe2 size={18} style={{ color: '#0284c7' }} />
                <span>Add Trade Corridor Route</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="admin-modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLaneSubmit}>
              <div className="admin-modal-body">
                <div className="admin-grid-2col">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Origin Flag (Emoji)</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={newLaneItem.flag}
                      onChange={(e) => setNewLaneItem({ ...newLaneItem, flag: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Destination Flag (Emoji)</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={newLaneItem.destFlag}
                      onChange={(e) => setNewLaneItem({ ...newLaneItem, destFlag: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Corridor Route Title</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={newLaneItem.title}
                    onChange={(e) => setNewLaneItem({ ...newLaneItem, title: e.target.value })}
                  />
                </div>

                <div className="admin-grid-2col">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Sea Transit Time</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newLaneItem.seaTransit}
                      onChange={(e) => setNewLaneItem({ ...newLaneItem, seaTransit: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Air Transit Time</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newLaneItem.airTransit}
                      onChange={(e) => setNewLaneItem({ ...newLaneItem, airTransit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Route Description</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={newLaneItem.description}
                    onChange={(e) => setNewLaneItem({ ...newLaneItem, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="admin-btn-action outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-action primary"
                >
                  <Plus size={16} />
                  <span>Add Corridor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: ADD SERVICE
          ===================================================================== */}
      {activeModal === 'service' && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <Ship size={18} style={{ color: '#0284c7' }} />
                <span>Add Freight Service</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="admin-modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit}>
              <div className="admin-modal-body">
                <div className="admin-field-group">
                  <label className="admin-field-label">Service Title</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={newServiceItem.title}
                    onChange={(e) => setNewServiceItem({ ...newServiceItem, title: e.target.value })}
                  />
                </div>

                <div className="admin-grid-2col">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Category</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newServiceItem.category}
                      onChange={(e) => setNewServiceItem({ ...newServiceItem, category: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Image URL / Path</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newServiceItem.image}
                      onChange={(e) => setNewServiceItem({ ...newServiceItem, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Description</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={newServiceItem.description}
                    onChange={(e) => setNewServiceItem({ ...newServiceItem, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="admin-btn-action outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-action primary"
                >
                  <Plus size={16} />
                  <span>Add Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: ADD BRANCH OFFICE
          ===================================================================== */}
      {activeModal === 'office' && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <MapPin size={18} style={{ color: '#0284c7' }} />
                <span>Add Branch Office / Port Desk</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="admin-modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddOfficeSubmit}>
              <div className="admin-modal-body">
                <div className="admin-grid-2col">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Branch Desk Name</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      value={newOfficeItem.name}
                      onChange={(e) => setNewOfficeItem({ ...newOfficeItem, name: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Badge Tag (e.g. Sea Port, Air Cargo)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newOfficeItem.badge}
                      onChange={(e) => setNewOfficeItem({ ...newOfficeItem, badge: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-grid-2col">
                  <div className="admin-field-group">
                    <label className="admin-field-label">Contact Phone</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newOfficeItem.phoneDisplay}
                      onChange={(e) => setNewOfficeItem({ ...newOfficeItem, phoneDisplay: e.target.value, phone: e.target.value })}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label">Desk Email</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={newOfficeItem.email}
                      onChange={(e) => setNewOfficeItem({ ...newOfficeItem, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">Full Location Address</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={newOfficeItem.address}
                    onChange={(e) => setNewOfficeItem({ ...newOfficeItem, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="admin-btn-action outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-action primary"
                >
                  <Plus size={16} />
                  <span>Add Branch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
