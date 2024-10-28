'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formTest } from './actions';
import { Data, DataSchema } from './schema';
import { CardContent, CardHeader } from '@/components/ui/card';
import MarkdownPreview from '@/components/advanced/MarkdownPreview';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function PageContent() {
  const [result, setResult] = useState('Waiting for submit...');
  const [loading, setLoading] = useState(false);
  const form = useForm<Data>({
    resolver: zodResolver(DataSchema),
    defaultValues: {
      username: 'Yuri2',
      email: 'yuri2@example.com',
      gender: 'male',
      agree: true,
    },
  });
  const { toast } = useToast();
  const onSubmit = (data: Data) => {
    setLoading(true);
    formTest(data)
      .then((res) => {
        setResult(JSON.stringify(res, null, 2));
        toast({
          title: 'Success',
          description: 'Form submitted successfully',
          variant: 'success',
        });
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  };
  return (
    <main className="flex gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Yuri2" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agree"
            render={({ field: { value, onChange, ...restField } }) => (
              <FormItem>
                <FormLabel>Terms and Conditions</FormLabel>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      {...restField}
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  </FormControl>
                  <FormLabel>
                    <p>I have read and agree to the</p>
                    <p
                      className="text-blue-500 underline cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      terms and conditions
                    </p>
                  </FormLabel>
                </FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="ringHover"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
      <div className="w-[460px]">
        <CardHeader>Result:</CardHeader>
        <CardContent>
          <MarkdownPreview>{'```json\n' + result + '\n```'}</MarkdownPreview>
        </CardContent>
      </div>
    </main>
  );
}
