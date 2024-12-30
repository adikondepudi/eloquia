// /src/components/therapist/client-list.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChevronRight, Search, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Client } from '@/types/therapist';

interface ClientListProps {
  clients: Client[];
}

export const ClientList = ({ clients }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Client>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/15 text-green-700 border-green-600/20';
      case 'inactive':
        return 'bg-gray-500/15 text-gray-700 border-gray-600/20';
      case 'pending':
        return 'bg-yellow-500/15 text-yellow-700 border-yellow-600/20';
      default:
        return 'bg-gray-500/15 text-gray-700 border-gray-600/20';
    }
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower)
    );
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * direction;
    }
    return 0;
  });

  const handleSort = (field: keyof Client) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Clients</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">Add Client</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('lastName')}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Name
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Session</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {client.firstName} {client.lastName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {client.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.nextSession ? (
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(client.nextSession), 'MMM d, yyyy')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(client.nextSession), 'h:mm a')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {client.recentProgress.weeklyChange >= 0 ? '+' : ''}
                      {client.recentProgress.weeklyChange.toFixed(1)}% week
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {client.recentProgress.monthlyChange >= 0 ? '+' : ''}
                      {client.recentProgress.monthlyChange.toFixed(1)}% month
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="flex items-center gap-1"
                  >
                    <Link href={`/therapist/clients/${client.id}`}>
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};