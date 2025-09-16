import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactUnlockButton } from "@/components/ui/contact-unlock-button";
import { Search, Plus, Mail, Phone, Building, User } from "lucide-react";

export function ContactsTab() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - replace with actual data from Supabase
  const contacts = [
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      company: "Tech Solutions Inc",
      title: "CEO",
      contactType: "customer",
      status: "active",
      lastContactDate: "2024-01-15"
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@healthtech.com",
      phone: "(555) 987-6543",
      company: "HealthTech Corp",
      title: "VP of Operations",
      contactType: "prospect",
      status: "active",
      lastContactDate: "2024-01-12"
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Brown",
      email: "m.brown@rehab.com",
      phone: "(555) 456-7890",
      company: "RehabPlus",
      title: "Director",
      contactType: "lead",
      status: "active",
      lastContactDate: "2024-01-10"
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case "customer": return "bg-green-100 text-green-800";
      case "prospect": return "bg-blue-100 text-blue-800";
      case "lead": return "bg-yellow-100 text-yellow-800";
      case "partner": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <Badge className={getContactTypeColor(contact.contactType)}>
                        {contact.contactType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{contact.company}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <ContactUnlockButton 
                        entityId={contact.id}
                        entityType="profile"
                        hasContactInfo={!!(contact.email || contact.phone)}
                        size="sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last contact: {new Date(contact.lastContactDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}