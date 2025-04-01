import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import Inventory from "@/pages/Inventory";
import Trading from "@/pages/Trading";
import Profile from "@/pages/Profile";
import { useState } from "react";
import { TONProvider } from "./lib/ton.jsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/trading" component={Trading} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TONProvider>
        <Router />
        <Toaster />
      </TONProvider>
    </QueryClientProvider>
  );
}

export default App;
