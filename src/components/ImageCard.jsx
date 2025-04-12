
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Download, ExternalLink, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const ImageCard = ({ image, index, onDownload }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  
  const gradients = [
    'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
    'bg-gradient-to-br from-emerald-500/10 to-cyan-500/10',
    'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
    'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
    'bg-gradient-to-br from-indigo-500/10 to-sky-500/10',
    'bg-gradient-to-br from-green-500/10 to-teal-500/10',
    'bg-gradient-to-br from-red-500/10 to-pink-500/10',
    'bg-gradient-to-br from-violet-500/10 to-purple-500/10',
  ];

  const borderGradients = [
    'border-blue-500/20',
    'border-emerald-500/20',
    'border-pink-500/20',
    'border-amber-500/20',
    'border-indigo-500/20',
    'border-green-500/20',
    'border-red-500/20',
    'border-violet-500/20',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${gradients[index % gradients.length]} border ${borderGradients[index % borderGradients.length]}`}>
        <div className="relative aspect-video overflow-hidden">
          {isLoading && (
            <Skeleton className="absolute inset-0 z-10 bg-gray-300/70" />
          )}
          {error && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/50">
              <span className="text-sm text-muted-foreground">Image could not be loaded</span>
            </div>
          )}
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError(true);
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="accent" className="shadow-md">
              {`Image ${index + 1}`}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{image.title}</CardTitle>
          <CardDescription className="line-clamp-2">{image.description}</CardDescription>
        </CardHeader>
        
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-9 p-0 flex justify-center" 
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" className="w-9 p-0 flex justify-center">
            <Share className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-9 p-0 flex justify-center" 
            onClick={() => window.open(image.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ImageCard;
