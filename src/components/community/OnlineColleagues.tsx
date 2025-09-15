import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wifi } from 'lucide-react';
import { usePresence } from '@/hooks/usePresence';

export const OnlineColleagues = () => {
  const { onlineColleagues, isLoading } = usePresence();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wifi className="h-5 w-5 text-green-500" />
            Online Colleagues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (onlineColleagues.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-muted-foreground" />
            Online Colleagues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            None of your colleagues are currently online
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wifi className="h-5 w-5 text-green-500" />
          Online Colleagues ({onlineColleagues.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {onlineColleagues.map((colleague) => (
            <div
              key={colleague.colleague_id}
              className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 hover:bg-muted transition-colors"
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={colleague.profile_photo_url} />
                  <AvatarFallback className="text-xs">
                    {colleague.first_name?.[0]}{colleague.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-sm font-medium truncate">
                  {colleague.first_name} {colleague.last_name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {colleague.current_position || colleague.current_employer}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {colleague.activity_status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};