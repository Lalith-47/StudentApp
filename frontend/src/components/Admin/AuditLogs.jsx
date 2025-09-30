import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  FilterList,
  Refresh,
  Visibility,
  Search,
  Clear,
  Security,
  Person,
  Settings,
  Delete,
  Edit,
  Add,
  Lock,
  CheckCircle,
  Error,
  Warning,
  Info,
} from "@mui/icons-material";
import { format } from "date-fns";
import apiService from "../../utils/api";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    action: "",
    category: "",
    severity: "",
    performedBy: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 50,
  });
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");

  const severityColors = {
    low: "success",
    medium: "warning",
    high: "error",
    critical: "error",
  };

  const severityIcons = {
    low: <CheckCircle />,
    medium: <Info />,
    high: <Warning />,
    critical: <Error />,
  };

  const actionIcons = {
    user_created: <Add color="success" />,
    user_updated: <Edit color="primary" />,
    user_deleted: <Delete color="error" />,
    user_status_updated: <Settings color="primary" />,
    user_password_reset: <Lock color="warning" />,
    course_created: <Add color="success" />,
    course_updated: <Edit color="primary" />,
    assignment_created: <Add color="success" />,
    announcement_created: <Add color="success" />,
    system_settings_updated: <Settings color="primary" />,
    bulk_grades_uploaded: <Security color="info" />,
  };

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      };

      const response = await apiService.admin.getAuditLogs(params);

      if (response.data.success) {
        setAuditLogs(response.data.data.auditLogs);
        setPagination(response.data.data.pagination);
      } else {
        setError("Failed to load audit logs");
      }
    } catch (err) {
      console.error("Error loading audit logs:", err);
      setError("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [pagination.currentPage, sortBy, sortOrder, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (event, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setFilters({
      action: "",
      category: "",
      severity: "",
      performedBy: "",
      startDate: "",
      endDate: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss");
  };

  const getActionDescription = (log) => {
    if (log.details?.description) {
      return log.details.description;
    }
    return log.action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading && auditLogs.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <Security sx={{ mr: 1, verticalAlign: "middle" }} />
        Audit Logs
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Monitor all administrative actions and system changes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Action"
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                placeholder="Search actions..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="user_management">User Management</MenuItem>
                  <MenuItem value="course_management">
                    Course Management
                  </MenuItem>
                  <MenuItem value="assignment_management">
                    Assignment Management
                  </MenuItem>
                  <MenuItem value="system_management">
                    System Management
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  onChange={(e) =>
                    handleFilterChange("severity", e.target.value)
                  }
                  label="Severity"
                >
                  <MenuItem value="">All Severities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Performed By"
                value={filters.performedBy}
                onChange={(e) =>
                  handleFilterChange("performedBy", e.target.value)
                }
                placeholder="User email..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Search />}
              onClick={loadAuditLogs}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={clearFilters}
            >
              Clear
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadAuditLogs}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {auditLogs.length} of {pagination.totalCount} audit logs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Page {pagination.currentPage} of {pagination.totalPages}
        </Typography>
      </Box>

      {/* Audit Logs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => handleSortChange("timestamp")}
                  sx={{ fontWeight: "bold" }}
                >
                  Timestamp
                  {sortBy === "timestamp" &&
                    (sortOrder === "asc" ? " ↑" : " ↓")}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => handleSortChange("action")}
                  sx={{ fontWeight: "bold" }}
                >
                  Action
                  {sortBy === "action" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </Button>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Performed By</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => handleSortChange("severity")}
                  sx={{ fontWeight: "bold" }}
                >
                  Severity
                  {sortBy === "severity" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </Button>
              </TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log._id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {formatTimestamp(log.timestamp)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {actionIcons[log.action] || <Security />}
                    <Typography variant="body2">
                      {log.action
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getActionDescription(log)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {log.performedBy?.name || "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.performedBy?.email || "Unknown"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={log.category?.replace(/_/g, " ") || "Unknown"}
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    icon={severityIcons[log.severity] || <Info />}
                    label={log.severity?.toUpperCase() || "UNKNOWN"}
                    color={severityColors[log.severity] || "default"}
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {auditLogs.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Security sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No audit logs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or check back later
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AuditLogs;
