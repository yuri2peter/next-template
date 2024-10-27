'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  // FormDescription,
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

export default function Page() {
  const [result, setResult] = useState('Waiting for submit...');
  const [loading, setLoading] = useState(false);
  const form = useForm<Data>({
    resolver: zodResolver(DataSchema),
    defaultValues: {
      username: 'Yuri2',
      email: 'yuri2@example.com',
      gender: 'male',
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
    <>
      <Head>
        <title>Form</title>
      </Head>
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
    </>
  );
}
